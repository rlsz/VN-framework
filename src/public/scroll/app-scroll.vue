<template>
  <div class="scroll-container">
    <div :class="{invisible: !showTopSentinel}"
         ref="topSentinel"
         class="top-sentinel"
         :style="{transform: sentinelTransform}"
    >下拉刷新</div>
    <div class="scroll"
         :style="{transform: scrollTransform}"
         ref="scroll"
         :id="hold!==undefined && 'position-holder'"
         @scroll="handleScroll"
         @touchstart="handleTouch"
         @touchend="handleTouch"
         @touchmove="handleTouch"
         @touchcancel="handleTouch"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import {ScrollService, ScrollType} from './scroll.service'
import {SimpleSubject} from "../base";

const TouchType = {
  touchstart: 'touchstart',
  touchmove: 'touchmove',
  touchend: 'touchend',
  touchcancel: 'touchcancel'
}

export default {
  name: 'app-scroll',
  props: ['hold'],
  di: {
    providers: [ScrollService],
    inject: {
      ss: ScrollService
    }
  },
  data() {
    return {
      showTopSentinel: false,
      events: new SimpleSubject(),
      sub: undefined,
      scrollSub: undefined,
      scroll: {
        top: true,
        bottom: false,
        position: 0
      },
      touch: null,
      boundary: {
        top: 100,
        bottom: 500
      }
      // log: []
    }
  },
  computed: {
    transformY() {
      if (!this.touch || !this.scroll.top) {
        return 0;
      } else {
        return Math.min(100, Math.max(0, this.touch.h)).toFixed(2)
      }
    },
    sentinelTransform() {
      return `translateY(calc(-50% + ${this.transformY / 2}px))`
    },
    scrollTransform() {
      return `translate3d(0px, ${this.transformY}px, 0px)`
    },
    scrollDom() {
      return this.$refs.scroll
    }
    // getLogger(){
    //     return this.log.filter((c,i)=>i>this.log.length - 10).join(', ')
    // }
  },
  watch: {
    'scroll.bottom'(val) {
      if (val) {
        this.ss.push({
          source: this.$el,
          type: ScrollType.pull_bottom
        })
      }
    }
  },
  methods: {
    handleScroll() {
      const target = this.scrollDom
      if (target.offsetHeight !== target.scrollHeight) {
        this.scroll.top = target.scrollTop < this.boundary.top
        this.scroll.bottom = target.scrollHeight - (target.offsetHeight + target.scrollTop) < this.boundary.bottom
        this.scroll.position = target.scrollTop
      }
    },
    handleTouch(e) {
      const t = e.changedTouches[0]
      this.events.next({
        id: t.identifier,
        x: t.pageX,
        y: t.pageY,
        type: e.type,
        time: Date.now(),
        // left: target.scrollHeight - (target.offsetHeight + target.scrollTop),
        scroll: JSON.parse(JSON.stringify(this.scroll)),
        event: e
      })
    },
    handlePeriod(start, end) {
      const span = end.time - start.time
      const spanY = end.y - start.y
      const spanX = end.x - start.x
      if (start.scroll.top && this.scroll.top && span > 200 && spanY > 100 && Math.abs(spanY) > Math.abs(spanX)) {
        this.ss.push({
          source: this.$el,
          type: ScrollType.pull_top
        })
      }
    }
  },
  created() {
    let start
    this.sub = this.events.subscribe(e => {
      if (e.type === TouchType.touchstart) {
        start = e
      } else if (e.type === TouchType.touchend || e.type === TouchType.touchcancel) {
        this.showTopSentinel = false
        if (start && e.id === start.id) {
          this.handlePeriod(start, e)
          start = undefined
          this.touch = null
        }
      } else if (e.type === TouchType.touchmove) {
        if (start && e.id === start.id) {
          if (start.scroll.top && this.scroll.top && e.y > start.y) {
            this.touch = {h: (e.y - start.y), x: e.x, y: e.y}
            this.showTopSentinel = true
            if (e.event.cancelable) {
              e.event.preventDefault()
            }
          }
        }
      }
    })
    this.scrollSub = this.ss.scrollEvents.subscribe(res => {
      if (res.type === ScrollType.pull_top) {
        this.$emit(ScrollType.pull_top)
      } else if (res.type === ScrollType.pull_bottom) {
        this.$emit(ScrollType.pull_bottom)
      }
    })
  },
  destroyed() {
    this.sub && this.sub.unsubscribe()
    this.scrollSub && this.scrollSub.unsubscribe()
  }
}
</script>
<style lang="less" scoped>
.scroll-container {
  display: flex;
  position: relative;
  flex-direction: column;
  flex: 1 1 0px;

  .scroll {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .invisible {
    visibility: hidden;
  }
}

.top-sentinel, .bottom-sentinel {
  display: flex;
  justify-content: center;

  font-size: 14px;
  line-height: 20px;

  opacity: 0.3;

  &:after {
    margin-left: 8px;
    align-self: center;
    cursor: pointer;
    content: "";
    border: solid gray;
    border-width: 0 1px 1px 0;
    padding: 3px;
  }
}

.top-sentinel {
  position: absolute;
  align-self: center;
  top: 0;

  &:after {
    transform: rotate(-135deg) translateY(-2px);
  }
}
</style>
