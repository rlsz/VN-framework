<template>
  <div>
    <button class="app-form" @click="normal()" v-loading-target>正常请求</button>
    <button class="app-form" @click="errorAjax()" v-loading-target>接口报错</button>
    <button class="app-form" @click="unauthorized()" v-loading-target>登录过期，弹窗重新登录</button>
    <button class="app-form" @click="unauthorized1()" v-loading-target>登录过期，跳转到登录页(测试场景为跳转到首页)</button>
    <button class="app-form" @click="independenceLoadingTest()" v-loading-target="independenceLoading">独立loading</button>
  </div>
</template>

<script>
import {AjaxService} from "@/public/base";
import {LoggerService} from "@/public/logger";
import {DialogService} from "@/public/dialogs";
import router from "@/app/router";

let authCount = 1

class MockAjaxService extends AjaxService {
  get(url, params, config) {
    return this.interceptor(headers => {
      return new Promise((r, j) => {
        setTimeout(() => {
          if (url === 'normal') {
            r({
              status: 200,
              data: {
                code: 200,
                data: 'normal test',
                message: 'success'
              }
            })
            return
          }
          if (url === 'errorAjax') {
            r({
              status: 200,
              data: {
                code: 400,
                data: null,
                message: 'errorAjax test'
              }
            })
            return
          }
          if (url === 'unauthorized') {
            authCount++
            if (authCount % 3 === 0) {
              r({
                status: 200,
                data: {
                  code: 200,
                  data: '已授权，接口正常响应',
                  message: 'success'
                }
              })
            } else {
              r({
                status: 200,
                data: {
                  code: 401,
                  data: null,
                  message: '未授权'
                }
              })
            }
            return
          }
          j('unknown error')
        }, 2000)
      })
    }, config)
  }

  openLogin() {
    return DialogService.instance.info({
      message: '点击确定按钮表示登录成功，点击背景或关闭图标表示登录失败',
      title: '登录测试',
      button: '确定'
    }).afterClosed()
  }
}

class MockAjaxService1 extends MockAjaxService {
  openLogin() {
    router.push('/main/home')
    return Promise.reject('登录过期')
  }
}

export default {
  name: "ajaxTest",
  di: {
    providers: [
      {provide: AjaxService, useClass: MockAjaxService},
      MockAjaxService1
    ],
    inject: {
      ajax: AjaxService,
      ajax1: MockAjaxService1,
      ls: LoggerService
    }
  },
  data() {
    return {
      independenceLoading: undefined
    }
  },
  methods: {
    normal() {
      this.ajax.get('normal').then(res => {
        this.ls.debug(res)
      })
    },
    errorAjax() {
      this.ajax.get('errorAjax').then(res => {
        this.ls.debug(res)
      })
    },
    unauthorized() {
      this.ajax.get('unauthorized').then(res => {
        this.ls.debug(res)
      })
    },
    unauthorized1() {
      this.ajax1.get('unauthorized').then(res => {
        this.ls.debug(res)
      })
    },
    independenceLoadingTest() {
      this.independenceLoading = 1
      this.ajax.get('normal', {}, {loading:false}).then(res => {
        this.ls.debug(res)
      }).finally(() => {
        this.independenceLoading = 0
      })
    },
  }
}
</script>

<style lang="less" scoped>
button {
  margin: 10px 5px;
}
</style>
