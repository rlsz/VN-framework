<template>
  <div class="app-guide-dialog flex vertical">
    <span class="title">{{options.title || '用户引导'}}</span>
    <pre class="desc">{{options.description || '-'}}</pre>
    <div class="flex cross-center">
      <span class="state" v-if="options.state">{{options.state}}</span>
      <span class="fill-content"></span>
      <ax-button class="ax-confirm" @click="dialog.close(true)" v-if="options.start">开始</ax-button>
      <ax-button v-if="options.showNextButton" @click="dialog.close(true)">下一步</ax-button>
      <ax-button @click="dialog.close()">跳出引导</ax-button>
    </div>
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
      return this.dialog.config || {}
    }
  }
}
</script>

<style lang="less" scoped>
.app-guide-dialog {
  padding: 16px 32px;
  min-width: 392px;
  width: 392px;

  button.app-form.ax-button {
    width: auto;
    min-width: 70px;
    height: 24px;
    font-size: 12px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    line-height: 12px;
  }
  .ax-button + .ax-button {
    margin-left: 8px;
  }
}
.title {
  font-size: 16px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: #21222d;
  line-height: 22px;

  margin-bottom: 14px;
}
.desc {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #757c94;
  line-height: 22px;

  margin-bottom: 24px;
}
.state {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: rgba(48, 50, 53, 0.6);
  line-height: 22px;
}
</style>
