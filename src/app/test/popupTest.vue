<template>
  <div class="flex vertical fill-content scroll" style="padding: 20px;align-items: flex-start;border:1px solid gray;">
    <button class="app-form" @click="fixedPosition({})">fixed position popup</button>
    <button class="app-form" @click="basic({anchor:$event.target,position: Position.left})">left popup</button>
    <button class="app-form" @click="basic({anchor:$event.target,position: Position.right})">right popup</button>
    <button class="app-form" @click="basic({anchor:$event.target,position: Position.top})">top popup</button>
    <button class="app-form" @click="basic({anchor:$event.target,position: Position.bottom})">bottom popup</button>
    <div ref="test" class="flex vertical" style="background: rgba(0,0,0,0.1);align-self: stretch;align-items: flex-start;">
      <div style="height: 500px;width: 10px;"></div>
      <button class="app-form" @click="basic({anchor:$event.target,position: Position.bottom, offset: 20})">bottom offset popup</button>
      <button class="app-form" @click="basic({anchor:$event.target,container:$el,position: Position.topStrict, offset: 20})">topStrict container offset popup</button>
      <button class="app-form" @click="basic({anchor:$event.target,container:$el,position: Position.bottom, offset: 20})">container popup</button>
      <div style="height: 1500px;width: 10px;"></div>
    </div>
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
  data(){
    return {
      Position
    }
  },
  methods: {
    basic(opts) {
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
        position: Position.right,
        ...opts
      })
      instance.afterClosed().then(res => {
        console.log('simpleComp result:', res)
      })
    },
    fixedPosition(opts) {
      this.ds.open({
        render(h) {
          return (<app-dialog-bridge>fixed position</app-dialog-bridge>)
        }
      }, {
        anchor: {
          addEventListener(){},
          removeEventListener(){},
          getBoundingClientRect(){
            const {width,height} = document.body.getBoundingClientRect()
            return { x: width, y: height/2, width: 0, height: 0 }
          }
        },
        position: Position.left,
        ...opts
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
