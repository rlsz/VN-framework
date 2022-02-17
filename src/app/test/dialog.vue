<template>
  <div>
    <button class="app-form" @click="basic()">basic dialog</button>
    <button class="app-form" @click="success()">success dialog</button>
    <button class="app-form" @click="info()">info dialog</button>
    <button class="app-form" type="button" @click="multiDialog">multi dialog</button>
    <button class="app-form" type="button" @click="multiDialog1">multi dialog in same time</button>
    <button class="app-form" @click="simpleComp()">简单组件</button>
    <button class="app-form" @click="openLoading()" v-loading-target>打开loading弹窗</button>
    <button class="app-form" @click="ajaxSimulator()" v-loading-target>模拟接口请求</button>
    <button class="app-form" @click="parentDialogTest()">弹窗父组件测试</button>
    <button class="app-form" @click="fillBody()">填充模式-网页全屏</button>
    <button class="app-form" @click="fillContainer()">填充模式-dom填充</button>
    <button class="app-form" @click="follow($event)">跟随</button>
    <button class="app-form" @click="fixed()">固定位置</button>
  </div>
</template>

<script>
import TestDialog from "./components/TestDialog";
import test1Dialog from "./components/test1Dialog";
import {LoggerService} from "@/public/logger";
import {DialogService, Model, Position} from "@/public/dialogs";
import {LoadingService} from "@/public/base";

export default {
  data() {
    return {}
  },
  di: {
    inject: {
      ls: LoggerService,
      ds: DialogService,
      loading: LoadingService
    }
  },
  created() {
    window.testDialog = this
  },
  methods: {
    basic() {
      this.ds.open(TestDialog, {
        model: Model.float,
        parent: this,
        title: 'test dialog',
        // center: true,
        'before-close': (done, data) => {
          console.log('before close:', data)
          this.ds.confirm('是否关闭弹窗？').then(() => {
            done()
          }).catch(() => {
          });
        }
      }).afterClosed().then(res => {
        this.ls.info('LoginComponent dialog closed:', res);
      });

    },
    simpleComp() {
      // this.ds.open({
      //   render(h){
      //     return h('div', {}, 'test')
      //   }
      // })

      // this.ds.open({
      //   render(h){
      //     return (<div>testhahaha</div>)
      //   }
      // })

      const instance = this.ds.open({
        render(h) {
          return h('app-dialog-bridge', {
            class: {
              'no-shadow': true
            },
            scopedSlots: {
              title: () => h('span', {}, '简单组件标题'),
              footer: props => h('button', {
                class: {'app-form': true},
                on: {
                  click(){
                    instance.close('test close')
                  }
                }
              }, 'test button')
            }
          }, [
            h('div', {}, 'test simple component')
          ])
        }
      })
      instance.afterClosed().then(res => {
        console.log('simpleComp result:', res)
      })
    },

    success() {
      this.ds.success({
        message: 'success test',
        subMessage: 'success sub message',
        title: 'success title',
        subTitle: 'success sub title',
        button: 'success button'
      }).afterClosed().then(res => {
        this.ls.info('success dialog closed', res);
      });
    },

    info() {
      this.ds.info('info test').afterClosed().then(res => {
        this.ls.info('info dialog closed', res);
      });
    },

    multiDialog() {
      this.ds.info('dialog 1').afterClosed().then(res => {
        if (res) {
          return this.ds.info('dialog 2').afterClosed()
        }
      }).then(res => {
        if (res) {
          return this.ds.open(TestDialog).afterClosed()
        }
      }).then(res => {
        if (res) {
          this.ls.success('multi dialog success')
        }
      })
    },
    multiDialog1() {
      this.ds.info('dialog 1dialog 1dialog 1dialog 1dialog 1dialog 1dialog 1dialog 1dialog 1dialog 1dialog 1dialog 1dialog 1')
      this.ds.info('dialog 2')
    },
    ajaxSimulator() {
      this.loading.increase()
      this.ls.debug('increase loading')
      setTimeout(() => {
        this.loading.decrease()
        this.ls.debug('decrease loading')
      }, 3000)
    },
    openLoading() {
      this.ds.open({
        render(h) {
          return h('i', {class: 'loading-general'})
        }
      }, {
        model: Model.transparent
      })
    },
    parentDialogTest() {
      this.ds.open(test1Dialog).afterClosed().then(() => {
        console.log('closed', this)
      })
    },
    fillBody() {
      this.ds.open({
        render(h){
          return (<div>fill container</div>)
        }
      }, {
        model: Model.fillAvailable
      })
    },
    fillContainer() {
      this.ds.open(test1Dialog, {
        model: Model.fillAvailable,
        container: this.$el
      })
    },
    follow(ev) {
      this.ds.open(test1Dialog, {
        anchor: ev.target,
        position: Position.top
      })
    },
    fixed() {
      this.ds.open(test1Dialog, {
        model: Model.fixed,
        backgroundCover: false
      })
      this.ds.open(test1Dialog, {
        model: Model.fixed,
        backgroundCover: false
      })
    }
  }
}
</script>

<style lang="less" scoped>
button {
  margin: 10px 5px;
}
</style>
