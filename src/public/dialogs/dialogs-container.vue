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
      this.dialogs.push(d)
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
  }
}
</script>
