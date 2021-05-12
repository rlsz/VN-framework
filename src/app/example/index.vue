<template>
  <router-view></router-view>
</template>

<script>
import {SomeService, MainAjaxService} from "./main.service";
import {AjaxService} from "@/public/base";

export default {
  di: {
    providers: [
      SomeService,
      MainAjaxService,
      {
        provide: AjaxService,
        useFactory(injector) {
          return new AjaxService(injector, 'http://www.test.com')
        }
      }
      // {
      //   provide: AjaxService,
      //   useClass: MainAjaxService
      // },
      // {
      //   provide: AjaxService,
      //   useExisting: MainAjaxService
      // }
    ]
  },
  created() {
  }
}
</script>

<style lang="less" scoped>
.body {

}
</style>
