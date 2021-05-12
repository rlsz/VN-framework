<template>
  <div class="page-frame bridge-default-dialog" :class="{center:center}">
    <div class="header">
      <span v-if="model===Model.fillAvailable" class="back" @click="close"></span>
      <slot name="title">
        <span>{{title}}</span>
      </slot>
      <span v-if="config.tip" class="tip">{{config.tip}}</span>
      <span v-if="model===Model.float" class="close" @click="close"></span>
    </div>
    <div class="body"><slot></slot></div>
    <div class="footer"><slot name="footer"></slot></div>
  </div>
</template>

<script>
import {Dialog, Model} from "../../dialogs/dialog";
import {PlatformService} from '../../platform/platform.service'
import {Platform} from '../../platform/platform'

export default {
  name: "app-dialog-bridge",
  di: {
    inject: {
      dialog: Dialog
    }
  },
  data() {
    return {
      Model
    }
  },
  computed: {
    config() {
      return this.dialog.config
    },
    hideHeader() {
      // return !this.$slots.title
      return false
    },
    title() {
      return this.config?.title || document.title
    },
    center() {
      return !!this.config?.center
    },
    model() {
      let model = this.config?.model
      if (!model) {
        model = PlatformService.instance.platform === Platform.pc ? Model.float : Model.fillAvailable
      }
      return model
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
.bridge-default-dialog {
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
  .header {
    position: relative;
    .tip {
      font-size: 12px;
      color: rgba(155, 155, 155, 1);
      line-height: 17px;
      margin-left: 8px;
      flex: 1 1 auto;
    }

    span.back {
      position: absolute;
      left: 8px;
      top: 20px;

      width: 10px;
      height: 18px;
      background: url("../../../assets/public/general_back_icon.png") center/cover no-repeat;
    }

    span.close {
      //font-size: 16px;
      //color: #909399;
      margin-left: auto;
      cursor: pointer;

      padding-left: 8px;
      position: relative;
      //position: absolute;
      //right: 2px;
      //top: 2px;

      width: 12px;
      height: 12px;
      //padding: 2px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-self: center;

      &:before, &:after {
        content: '';
        background-color: #2c3e50;
        width: 2px;
        height: 100%;
        position: absolute;
      }

      &:before {
        transform: rotate(45deg);
      }

      &:after {
        transform: rotate(-45deg);
      }
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
