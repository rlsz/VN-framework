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
import {getScrollParent} from "@/public/base";

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
      offset: 4,
      lastScrollParent: null
    }
  },
  computed: {
    topHeight() {
      return (this.layoutParams.top - this.offset) + 'px'
    },
    bottomHeight() {
      return (this.viewportHeight - this.layoutParams.bottom - this.offset) + 'px'
    },
    leftWidth() {
      return (this.layoutParams.left - this.offset) + 'px'
    },
    rightWidth() {
      return (this.viewportWidth - this.layoutParams.right - this.offset) + 'px'
    },
    scrollParent() {
      if(!this.guide.target) {
        return null
      }
      return getScrollParent(this.guide.target);
    }
  },
  watch: {
    'guide.target': {
      handler(el) {
        this.refresh()
      },
      immediate: true
    },
    'scrollParent': {
      handler(el) {
        if(this.lastScrollParent) {
          this.lastScrollParent.removeEventListener("scroll", this.onScroll);
          this.lastScrollParent = null
        }
        if(el) {
          el.addEventListener("scroll", this.onScroll);
          this.lastScrollParent = el
        }
      },
      immediate: true
    }
  },
  mounted() {
    window.addEventListener('resize', this.refresh);
  },
  destroyed() {
    window.removeEventListener('resize', this.refresh);
  },
  methods: {
    refresh() {
      const body = document.body.getBoundingClientRect();
      this.viewportWidth = body.width
      this.viewportHeight = body.height
      const el = this.guide.target
      if(el) {
        this.layoutParams = el.getBoundingClientRect()
      } else {
        this.layoutParams = null
      }
    },
    onScroll() {
      this.refresh()
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
  z-index: 10;
}
.mask-top, .mask-left, .mask-right, .mask-bottom {
  background-color: rgba(0, 0, 0, 0.2);
  pointer-events: auto;
}
.mask, .mask-middle, .app-guide-mask-root{
  pointer-events: none;
}
</style>
