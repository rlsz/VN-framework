<template>
  <div class="actions-dialog" :style="{minWidth: config.minWidth,maxWidth: config.maxWidth}">
    <span v-for="(action,index) in actions"
          :key="'dialog-action-item-'+index"
          class="action flex cross-center"
          :class="{disabled:action.disabled, active:action.active}"
          @click="action.handler(dialog)"
    >
      <template v-if="config.limitLine">
        <span class="fill-content" v-limit-line="config.limitLine">{{action.text}}</span>
      </template>
      <template v-else>
        <span class="fill-content">{{action.text}}</span>
      </template>
      <i class="correct-css-thin"></i>
    </span>
    <span class="empty" v-if="!actions.length">无数据</span>
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
  },
  watch: {
    actions() {
      this.$nextTick(() => {
        this.dialog._vm.fixPositionByAnchor()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.actions-dialog {
  padding: 5px 0px;
  color: #606266;
  line-height: 1.4;
  font-size: 14px;

  display: flex;
  flex-direction: column;

  .action {
    cursor: pointer;
    text-decoration: none;
    padding: 7px 12px;
    .correct-css-thin {
      height: auto;
      opacity: 0;
    }

    &:hover {
      color: #3667D4;
      text-decoration: underline;
      background: #f5f6f7;
    }

    &.active {
      color: #3667D4;
      .correct-css-thin {
        opacity: 1;
      }
    }

    &.disabled {
      pointer-events: none;
      color: #C0C4CC;
    }

    //& ~ .action {
    //  margin-top: 9px;
    //}
  }
  .empty {
    color: rgba(0,0,0,0.3);
    padding: 2px 12px;
  }
}
</style>
