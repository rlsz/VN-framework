<template>
  <app-dialog-bridge>
    <span slot="title">dialog parent test</span>
    <span>dialog content</span>
    <span slot="footer" style="text-align: right;">
      <button class="app-form" @click="dialog.close()">取 消</button>
      <button class="app-form" @click="submit" v-loading-target>确 定</button>
    </span>
  </app-dialog-bridge>
</template>

<script>
import {Dialog, DialogParent} from "@/public/dialogs";
import {LoggerService} from "@/public/logger";
import {AjaxService} from "@/public/base";

export default {
  di: {
    inject: {
      dialog: Dialog,
      parent: DialogParent,
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
    console.log('parent', this.parent)
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
