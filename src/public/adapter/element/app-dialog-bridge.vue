<template>
  <div class="page-frame bridge-el-dialog" :class="{center:center}">
    <div class="header" :class="{'hide-header': hideHeader}">
      <slot name="title">
        <span>{{title}}</span>
      </slot>
      <i class="el-icon el-icon-close" @click="close"></i>
    </div>
    <div class="body"><slot></slot></div>
    <div class="footer"><slot name="footer"></slot></div>
  </div>
</template>

<script>
import {Dialog} from "../../dialogs/dialog";

export default {
  name: "app-dialog-bridge",
  di: {
    inject: {
      dialog: Dialog
    }
  },
  computed: {
    hideHeader() {
      // return !this.$slots.title
      return false
    },
    title() {
      return this.dialog.config?.title || document.title
    },
    center() {
      return !!this.dialog.config?.center
    }
  },
  methods: {
    close(){
      this.dialog.close()
    }
  }
}
</script>

<style lang="less" scoped>
.bridge-el-dialog {
  min-height: 100px;
  min-width: 100px;
  &.no-shadow {
    > .header {
      box-shadow: none;
    }
    > .footer {
      box-shadow: none;
    }
  }
}
.page-frame{
  flex-basis: auto;
  height: auto;
  background: inherit;
  > .header {
    flex-direction: row;
    line-height: 24px;
    font-size: 18px;
    color: #303133;
    align-items: center;

    //position: absolute;
    //top: 0;
    //left: 0;
    //right: 0;
    //padding: 20px 20px 10px;
    //background: white;

    padding: 20px 20px 10px 44px;
    font-weight: bolder;
    z-index: 1;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.07);
    i.el-icon-close {
      font-size: 16px;
      color: #909399;
      margin-left: auto;
      cursor: pointer;

      padding-left: 8px;
    }
    &.hide-header {
      display: none;
    }
  }
  > .body {
    padding: 10px 20px;
    flex-basis: auto;
  }
  > .footer {
    padding: 10px 20px 20px;
    z-index: 1;
    box-shadow: 0px -1px 4px 0px rgba(0, 0, 0, 0.07);
  }
}
</style>
