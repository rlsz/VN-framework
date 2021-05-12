<template>
  <div class="page-frame bridge-van-popup">
    <div class="header" :class="{'hide-header': hideHeader}">
      <slot name="title"></slot>
<!--      <i class="el-icon el-icon-close" @click="close"></i>-->
      <van-icon name="close" @click="close"/>
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
      return !this.$slots.title
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
.page-frame{
  flex-basis: auto;
  height: auto;
  background: inherit;
}
.header {
  flex-direction: row;
  line-height: 24px;
  font-size: 18px;
  color: #303133;
  align-items: center;

  //position: absolute;
  //top: 0;
  //left: 0;
  //right: 0;
  padding: 20px 20px 10px;
  background: white;
  i.el-icon-close, i.van-icon-close {
    font-size: 16px;
    color: #909399;
    margin-left: auto;
  }
  &.hide-header {
    display: none;
  }
}
.body {
  flex-basis: auto;
}
.footer {
  text-align: right;
}

</style>
