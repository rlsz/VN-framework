<template>
  <div>
    <button type="button" class="app-form" @click="ls.debug('test debug')">debug</button>
    <button type="button" class="app-form" @click="ls.info('test info')">info</button>
    <button type="button" class="app-form" @click="success">success</button>
    <button type="button" class="app-form" @click="ls.error('test error')">error</button>
    <button type="button" class="app-form" @click="ls.error('')">empty error</button>
    <button type="button" class="app-form" @click="ls.warning('test warning')">warning</button>
    <button type="button" class="app-form" @click="ls.info('test info', OutputMethod.dialog)">info dialog</button>
    <button type="button" class="app-form" @click="multiLog">multi log</button>
  </div>
</template>

<script>
import {LoggerService, OutputMethod} from '@/public/logger'
let index = 0

export default {
  name: "logger",
  data() {
    return {
      OutputMethod
    }
  },
  di: {
    inject: {
      ls: LoggerService
    }
  },
  methods: {
    multiLog(){
      this.ls.success('test success 1')
      this.ls.success('test success 2')
      this.ls.success('test success 3')
      this.ls.info('test info 1')
      this.ls.info('test info 2')
      this.ls.info('test info 3')
      this.ls.warning('test warning 1')
      this.ls.warning('test warning 2')
      this.ls.warning('test warning 3')
    },
    success() {
      this.ls.success('test success ' + index)
      if(index < 10) {
        index++
      }
    }
  }
}
</script>

<style lang="less" scoped>
button {
  margin: 10px 5px;
}
</style>
