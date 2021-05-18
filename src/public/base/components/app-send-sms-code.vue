<template>
  <span class="app-send-sms-code" @click="onSend">{{ tick ? time + 's后可再次发送' : '获取验证码' }}</span>
</template>

<script>
import {Tick} from "../utils";

export default {
  name: "app-send-sms-code",
  props: ['beforeSend'], // before-send: () => Promise<boolean>
  data() {
    return {
      disabled: false,
      tick: null,
      time: 0
    }
  },
  created() {

  },
  methods: {
    onSend() {
      if (this.disabled || this.tick) {
        return;
      }
      const canSend = this.beforeSend ? Promise.resolve(this.beforeSend()) : Promise.resolve(true)
      canSend.then(() => {
        this.$emit('tick-start')
        this.tick = Tick(60, time => {
          this.time = time
        }).then(() => {
          this.tick = null
          this.$emit('tick-end')
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.app-send-sms-code {
  color: #3667D4;
  cursor: pointer;

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
