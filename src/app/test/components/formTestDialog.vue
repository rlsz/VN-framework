<template>
  <app-dialog-bridge>
    <span slot="title">form test</span>
    <div class="flex vertical">
      <app-textarea v-model="form.text"
                    :maxlength="1000"
                    placeholder="请输入内容"
      ></app-textarea>
    </div>
    <span slot="footer" style="text-align: right;">
      <button class="app-form" @click="dialog.close()">取 消</button>
      <button class="app-form" @click="submit" v-loading-target>确 定</button>
    </span>
  </app-dialog-bridge>
</template>

<script>
import {Dialog} from "@/public/dialogs";
import {LoggerService} from "@/public/logger";
import {AjaxService, timer} from "@/public/base";

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
      form: {
        text: ''
      }
    }
  },
  computed: {
    config() {
      return this.dialog.config
    }
  },
  created() {
    timer(1000).then(res => {
      this.form.text = 'refresh()refresh()refresh()refresh()refresh()refresh()refresh()refresh()refresh()refresh()refresh()refresh()refresh()refresh()refresh()'
    })
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
.bridge-default-dialog {
  min-width: 400px !important;
}
button {
  display: inline-block;
  margin: 0px 5px;
}
</style>
