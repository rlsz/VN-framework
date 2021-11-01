<template>
  <div class="app-guide-dialog flex cross-center">
    <span>{{options.description || '-'}}</span>
    <span class="next link" @click="dialog.close(true)" v-if="options.next">下一步</span>
    <span class="next link" @click="dialog.close()" v-else>关闭</span>
  </div>
</template>

<script>
import {Dialog} from "@/public/dialogs";
import {LoggerService} from "@/public/logger";

export default {
  di: {
    inject: {
      dialog: Dialog,
      ls: LoggerService
    }
  },
  data() {
    return {

    }
  },
  computed: {
    options() {
      return this.dialog.config?.options || {}
    }
  }
}
</script>

<style lang="less" scoped>
.app-guide-dialog {
  padding: 10px 20px;
}
.next {
  margin-left: 20px;
}
</style>
