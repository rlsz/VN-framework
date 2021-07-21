<template>
  <div class="actions-dialog">
    <span v-for="(action,index) in actions"
          :key="'dialog-action-item-'+index"
          class="action"
          @click="action.handler(dialog)"
    >{{action.text}}</span>
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
      return this.dialog.config || {}
    },
    actions() {
      // action: { text, handler }
      return this.config.actions || []
    }
  }
}
</script>

<style lang="less" scoped>
.actions-dialog {
  padding: 12px;
  color: #606266;
  line-height: 1.4;
  font-size: 14px;

  display: flex;
  flex-direction: column;

  .action {
    cursor: pointer;
    text-decoration: none;

    &:hover {
      color: #3667D4;
      text-decoration: underline;
    }

    &.active {
      color: #3667D4;
    }

    &.disabled {
      pointer-events: none;
      color: #C0C4CC;
    }

    & ~ .action {
      margin-top: 9px;
    }
  }
}
</style>
