<template>
  <div class="dialog-root">
    <template v-for="(dialog) in dialogs">
      <dialog-item :options="dialog" :key="dialog.instance.id"></dialog-item>
    </template>
  </div>
</template>

<script>
import {DialogItem} from '../adapter'
import {LoggerService} from "../logger";
import {DialogService} from "./dialog.service";

export default {
  name: "dialogs-container",
  components: {
    [DialogItem.name]: DialogItem
  },
  data() {
    return {
      dialogs: [],
      dialogSub: null
    }
  },
  di: {
    inject: {
      ls: LoggerService,
      ds: DialogService
    }
  },
  created() {
    this.dialogSub = this.ds.dialog.subscribe(d => {
      if (d.instance.config?.anchor) {
        const targets = this.dialogs.filter(c => c.instance.config?.anchor)
        if(targets.length) {
          Promise.all(targets.map(c => c.instance.afterClosed())).then(() => {
            this.dialogs.push(d)
          })
          targets.forEach(c => c.instance.close())
        } else {
          this.dialogs.push(d)
        }
      } else {
        this.dialogs.push(d)
      }
      d.instance.afterClosed().then(() => {
        this.dialogs.splice(this.dialogs.indexOf(d), 1)
      })
      this.dialogs.filter(c => !c.instance.config?.anchor).forEach((item, index, arr) => {
        item.instance.afterOpened().then(() => {
          item.instance._vm.hide = index !== arr.length - 1
        })
      })
    })
  },
  mounted() {

  },
  destroyed() {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe()
    }
  }
}
</script>
<style lang="less" scoped>
.dialog-root {
  //> :not(:last-child) {
  //  opacity: 0;
  //}
}
</style>
