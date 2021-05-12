<template>
  <app-dialog-bridge class="dialog-bridge no-shadow">
    <span v-if="data.title" slot="title" class="flex vertical cross-center">
      <h1>{{data.title}}</h1>
      <h2 v-if="data.subTitle">{{data.subTitle}}</h2>
    </span>
    <div class="success-wrapper">
      <img src="../../assets/public/done_pic.png"/>
      <div>{{data.message}}</div>
      <div class="sub-message" v-if="data.subMessage">{{data.subMessage}}</div>
    </div>
    <button class="app-form" slot="footer" @click="submit()">{{data.button || '确定'}}</button>
  </app-dialog-bridge>
</template>

<script>
import {Dialog} from "./dialog";

export default {
  name: "success-dialog",
  di: {
    inject: {
      dialog: Dialog
    }
  },
  computed: {
    data() {
      return this.dialog.config?.data
    }
  },
  methods: {
    submit() {
      this.dialog.close(true);
    }
  }
}
</script>

<style lang="less" scoped>
.success-wrapper {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
  line-height: 16px;
  min-height: 300px;
  padding: 0 40px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    margin-bottom: 22px;
  }
  & + button {
    margin: 0 40px;
  }
  .sub-message {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #323335;
    line-height: 20px;
    margin-top: 8px;
  }
}
.dialog-bridge {
  min-width: 320px;
}
</style>
