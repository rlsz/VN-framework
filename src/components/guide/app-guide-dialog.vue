<template>
  <div class="app-guide-dialog">{{config.description || '-'}}</div>
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
    config() {
      return this.dialog.config
    }
  },
}
</script>

<style lang="less" scoped>
.app-guide-dialog {
  padding: 10px 20px;
}
</style>
