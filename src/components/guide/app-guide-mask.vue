<template>
  <div class="app-guide-mask-root flex vertical" v-if="layoutParams">
    <div class="mask-top" :style="{height: topHeight}"></div>
    <div class="mask-middle fill-content flex">
      <span class="mask-left" :style="{width: leftWidth}"></span>
      <span class="mask fill-content"></span>
      <span class="mask-right" :style="{width: rightWidth}"></span>
    </div>
    <div class="mask-bottom" :style="{height: bottomHeight}"></div>
  </div>
</template>

<script>
import {GuideService} from "./guide.service";

export default {
  name: "app-guide-mask",
  di: {
    inject: {
      guide: GuideService
    }
  },
  data() {
    return {
      layoutParams: null,
      viewportWidth: 0,
      viewportHeight: 0,
      listener: this.refresh.bind(this)
    }
  },
  computed: {
    topHeight() {
      return this.layoutParams.top + 'px'
    },
    bottomHeight() {
      return (this.viewportHeight - this.layoutParams.bottom) + 'px'
    },
    leftWidth() {
      return this.layoutParams.left + 'px'
    },
    rightWidth() {
      return (this.viewportWidth - this.layoutParams.right) + 'px'
    }
  },
  watch: {
    'guide.current.target': {
      handler(el) {
        this.refresh()
      },
      immediate: true
    }
  },
  mounted() {
    window.addEventListener('resize', this.listener);
  },
  destroyed() {
    window.removeEventListener('resize', this.listener);
  },
  methods: {
    refresh() {
      console.log('refresh viewport')
      const body = document.body.getBoundingClientRect();
      this.viewportWidth = body.width
      this.viewportHeight = body.height
      const el = this.guide.current?.target
      if(el) {
        this.layoutParams = el.getBoundingClientRect()
      } else {
        this.layoutParams = null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.app-guide-mask-root {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
}
.mask-top, .mask-left, .mask-right, .mask-bottom {
  background-color: rgba(0, 0, 0, 0.2);
  pointer-events: auto;
}
.mask, .mask-middle, .app-guide-mask-root{
  pointer-events: none;
}
</style>
