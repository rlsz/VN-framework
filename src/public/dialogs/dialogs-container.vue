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
import {State} from "./dialog";

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
  watch: {
    dialogs() {
      this.refreshHiddenStatus()
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
    })
  },
  mounted() {

  },
  destroyed() {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe()
    }
  },
  methods: {
    refreshHiddenStatus() {
      this.dialogs.filter(c => {
        if(!c.instance.config) {
          return true
        }
        if(c.instance.config.backgroundCover !== undefined) {
          return !!c.instance.config.backgroundCover
        }
        if(c.instance.config.anchor) {
          return false
        }
        return true
      }).forEach((item, index, arr) => {
        if(item.instance._state._value === State.opened) {
          item.instance._vm.hide = index !== arr.length - 1
        } else {
          item.instance.afterOpened().then(() => {
            item.instance._vm.hide = index !== arr.length - 1
          })
        }
      })
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
