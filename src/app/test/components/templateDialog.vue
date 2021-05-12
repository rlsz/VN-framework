<template>
  <app-dialog-bridge>
    <span slot="title">title</span>
    <span>dialog content</span>
    <span slot="footer">
        <el-button v-loading-target type="primary" @click="submit">确 定</el-button>
        <el-button @click="dialog.close()">取 消</el-button>
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
  },
  methods: {
    submit() {
      this.ajax.post('submit', {}).then(res => {
        this.ls.success('success')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.bridge-el-dialog {
  min-width: 400px;
}
</style>
