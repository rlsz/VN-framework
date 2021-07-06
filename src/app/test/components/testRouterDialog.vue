<template>
  <app-dialog-bridge>
    <span slot="title">title</span>
    <button class="app-form" @click="test">test</button>
    <span slot="footer" style="text-align: right;">
      <button class="app-form" @click="dialog.close()">取 消</button>
      <button class="app-form" @click="submit" v-loading-target>确 定</button>
    </span>
  </app-dialog-bridge>
</template>

<script>
import {Dialog} from "@/public/dialogs";
import {LoggerService} from "@/public/logger";
import {AjaxService} from "@/public/base";

export default {
  di: {
    inject: {
      dialog: Dialog,
      ls: LoggerService,
      ajax: AjaxService
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
  created() {
    window.test1 = this
  },
  methods: {
    submit() {
      this.ajax.post('submit', {}).then(res => {
        this.ls.success('success')
      })
    },
    test() {
      console.log('test dialog router:', this.$router)
    }
  }
}
</script>

<style lang="less" scoped>
.bridge-el-dialog {
  min-width: 400px;
}
button {
  display: inline-block;
  margin: 0px 5px;
}
</style>
