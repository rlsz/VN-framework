<template>
  <div>
    <button ref="test" class="app-form" @click="basic()">basic popup</button>
  </div>
</template>

<script>
import {LoggerService} from "@/public/logger";
import {DialogService, Model, Position} from "@/public/dialogs";
import {LoadingService} from "@/public/base";

export default {
  name: "popupTest",
  di: {
    inject: {
      ls: LoggerService,
      ds: DialogService,
      loading: LoadingService
    }
  },
  methods: {
    basic() {
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
      }, {
        anchor: this.$refs.test,
        position: Position.right
      })
      instance.afterClosed().then(res => {
        console.log('simpleComp result:', res)
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
