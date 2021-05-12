<template>
  <div class="log-dialog">
    {{ log.summary }}
  </div>
</template>

<script>
import {Dialog} from "../../dialogs/dialog";

export default {
  di: {
    inject: {
      dialog: Dialog
    }
  },
  computed: {
    config() {
      return this.dialog.config
    },
    log() {
      return this.config.data
    }
  }
}
</script>

<style lang="less" scoped>
.log-dialog {
  padding: 16px;
  border-radius: 4px;
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
}
</style>
