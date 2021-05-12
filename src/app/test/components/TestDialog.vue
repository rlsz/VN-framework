<template>
  <app-dialog-bridge>
    <!--    <span slot="title">slot title will override dialog title</span>-->
    <span>dialog content</span>
    <span>{{as}}</span>
    <div style="height: 1000px;">large content</div>
    <span slot="footer" style="text-align: right;">
      <button class="app-form" @click="handleClose">取 消</button>
      <button class="app-form" @click="submit">确 定</button>
    </span>
  </app-dialog-bridge>
</template>

<script>
import {Dialog, DialogService} from "@/public/dialogs";
import {AppService} from "@/app/app.service";

export default {
  name: "TestDialog",
  di: {
    providers: [
      // {provide: AppService, useValue: AppService.instance}, // AppService全局单例的情况下可以直接这样注入
      {
        provide: AppService,
        useFactory(injector) {
          return injector.get(Dialog).config?.parent?.$injector.get(AppService) || null // null表示provider存在但为空，不会导致di报错
        }
      }
    ],
    inject: {
      dialog: Dialog,
      ds: DialogService,
      as: AppService
    }
  },
  computed: {
    config() {
      return this.dialog.config
    }
  },
  data() {
    return {}
  },
  created() {
    console.log(this.$ls)
    console.log('---', this.dialog, this.config)
    console.log('AppService from config.parent:', this.as, this.as === AppService.instance)
  },
  methods: {
    handleClose() {
      this.dialog.close()
    },
    submit() {
      this.ds.confirm('模拟异步请求').then(() => {
        this.dialog.close('data')
      }).catch(() => {
      });
    }
  }
}
</script>

<style lang="less" scoped>
.bridge-el-dialog {
  //min-width: 400px;
}

button {
  display: inline-block;
  margin: 0px 5px;
}
</style>
