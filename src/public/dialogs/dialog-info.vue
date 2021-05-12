<template>
  <app-dialog-bridge class="dialog-bridge no-shadow">
    <span v-if="data.title" slot="title" class="flex vertical cross-center">
      <h1>{{data.title}}</h1>
    </span>
    <div class="message">{{ data.message }}</div>
    <button class="app-form" slot="footer" @click="submit()">{{ data.button || '确定' }}</button>
  </app-dialog-bridge>
</template>

<script>
import {Dialog} from "@/public/dialogs/dialog";

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
.message {
  flex: 1 1 auto;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
  line-height: 16px;
  padding: 0 40px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & + button {
    margin: 0 40px;
  }
}
.dialog-bridge {
  min-width: 320px;
  min-height: 220px;
}
</style>
