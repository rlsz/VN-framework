<template>
  <div class="sticky-container">
    <div class="sticky-inner"
         ref="scroll"
         @scroll="handleScroll"
         @touchstart="handleTouch"
         @touchend="handleTouch"
         @touchmove="handleTouch"
         @touchcancel="handleTouch"
    >
      <div class="start-sentinel"></div>
      <slot></slot>
      <div class="end-sentinel"></div>
    </div>
    <div class="tips">
      <span class="bottom-tip" v-for="(child,index) in children"
            :key="'sticky-bottom-tip-key-'+index"
            :class="{active:activeIndex===index}"></span>
    </div>
    <img v-platform class="action left" src="../../../assets/public/banner_left_hover_icon.png" @click="scrollToPrev()"/>
    <img v-platform class="action right" src="../../../assets/public/banner_right_hover_icon.png" @click="scrollToNext()"/>
  </div>
</template>

<script>
import {SimpleSubject} from "../utils";

const TouchType = {
  touchstart: 'touchstart',
  touchmove: 'touchmove',
  touchend: 'touchend',
  touchcancel: 'touchcancel'
}

/**
 * autoScroll: number - default undefined, unit ms
 * loop: boolean - default false
 */
export default {
  name: "app-sticky-container",
  props: ['autoScroll', 'loop'],
  data() {
    return {
      events: new SimpleSubject(),
      sub: undefined,
      touch: null,
      current: null,
      autoScrollTimer: null,
      children: null,
      activeIndex: 0,
      lastHtml: '',
      sequence: 0,
    }
  },
  computed: {
    transformX() {
      if (!this.touch) {
        return 0;
      } else {
        return this.touch.w.toFixed(2)
      }
    },
    loopProp() {
      return this.loop !== undefined && this.loop !== false
    }
  },
  created() {
    let start, startPosition
    this.sub = this.events.subscribe(e => {
      if (e.type === TouchType.touchstart) {
        start = e
        startPosition = this.$refs.scroll.scrollLeft
      } else if (e.type === TouchType.touchend || e.type === TouchType.touchcancel) {
        if (start && e.id === start.id) {
          start = undefined
          this.touch = null
          this.scrollToTarget()
        }
      } else if (e.type === TouchType.touchmove) {
        if (start && e.id === start.id) {
          this.touch = {h: (e.y - start.y), w: (e.x - start.x), x: e.x, y: e.y}
        }
        if (e.event.cancelable) {
          e.event.preventDefault()
        }
        this.$refs.scroll.scrollLeft = startPosition - this.transformX
      }
    })
  },
  mounted() {
    this.refresh()
  },
  destroyed() {
    this.sub && this.sub.unsubscribe()
    this.autoScrollTimer && clearTimeout(this.autoScrollTimer)
  },
  updated() {
    this.refresh()
  },
  methods: {
    refresh() {
      const content = this.$refs.scroll && this.$refs.scroll.innerHTML
      if(this.lastHtml !== content){
        this.lastHtml = content
        this.init()
      }
    },
    init() {
      this.children = Array.from(this.$refs.scroll.children)
          .filter(c => ['start-sentinel', 'end-sentinel'].indexOf(c.className) < 0)
      this.scrollToTarget()
      this.resetAutoScroll()
    },
    getChildren() {
      const target = this.$refs.scroll
      const {width: viewWidth, left: viewLeft} = target.getBoundingClientRect()
      let visibleChild = null
      const children = this.children.map((c, index) => {
        const {left, width} = c.getBoundingClientRect()
        const child = {
          index,
          visible: false,
          target: c,
          distance: left - viewLeft - (viewWidth - width) / 2
        }
        if (!visibleChild) {
          visibleChild = child
        } else if (Math.abs(child.distance) < Math.abs(visibleChild.distance)) {
          visibleChild = child
        }
        return child
      })
      if (visibleChild) {
        visibleChild.visible = true
      }
      return children
    },
    getVisibleTarget() {
      return this.getChildren().find(c => c.visible)
    },
    scrollToTarget(target) {
      this.sequence++
      const currentSeq = this.sequence
      return new Promise((r, j) => {
        target = target || this.getVisibleTarget()
        if (target) {
          const scroll = this.$refs.scroll
          let distance = target.distance
          let step = Math.max(Math.ceil(Math.abs(distance) / 16), 16)
          const animate = () => {
            if(currentSeq !== this.sequence) {
              return j('cancel')
            }
            // console.log(distance, step, scroll.scrollLeft)
            if (distance > step) {
              scroll.scrollLeft += step
              distance -= step
              window.requestAnimationFrame(animate)
            } else if (distance < -step) {
              scroll.scrollLeft -= step
              distance += step
              window.requestAnimationFrame(animate)
            } else {
              scroll.scrollLeft += distance
              distance -= distance
              this.resetAutoScroll()
              this.activeIndex = target.index
              r(target)
              // console.log(distance, step, scroll.scrollLeft)
            }
          }
          animate()
          // target.target.scrollIntoView({behavior: "smooth", block: "center", inline: "center"}) // safari兼容性不好
        }
      })
    },
    fixIndex(i, len) {
      const index = i % len;
      if (index < 0) {
        return index + len;
      } else {
        return index;
      }
    },
    scrollToNext() {
      const loop = this.loopProp
      const children = this.getChildren()
      const current = children.find(c => c.visible)
      if (current) {
        let newIndex = current.index + 1
        if (!loop && newIndex >= children.length) {
          return;
        }
        newIndex = this.fixIndex(newIndex, children.length)
        const newTarget = children[newIndex]
        if (newTarget) {
          this.scrollToTarget(newTarget)
        }
      }
    },
    scrollToPrev() {
      const loop = this.loopProp
      const children = this.getChildren()
      const current = children.find(c => c.visible)
      if (current) {
        let newIndex = current.index - 1
        if (!loop && newIndex < 0) {
          return;
        }
        newIndex = this.fixIndex(newIndex, children.length)
        const newTarget = children[newIndex]
        if (newTarget) {
          this.scrollToTarget(newTarget)
        }
      }
    },
    resetAutoScroll() {
      if (!this.autoScroll) {
        return
      }
      if (this.autoScrollTimer) {
        clearTimeout(this.autoScrollTimer)
      }
      this.autoScrollTimer = setTimeout(() => {
        this.scrollToNext()
      }, this.autoScroll)
    },
    handleScroll() {
    },
    handleTouch(e) {
      const t = e.changedTouches[0]
      this.events.next({
        id: t.identifier,
        x: t.pageX,
        y: t.pageY,
        type: e.type,
        time: Date.now(),
        event: e
      })
    }
  }
}
</script>

<style lang="less" scoped>
.sticky-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  /deep/ .sticky-inner > * {
    flex: 0 0 auto;
  }
}

.sticky-inner {
  display: flex;
  overflow-x: auto;

  padding-bottom: 30px;
  margin-bottom: -30px;
}

.start-sentinel, .end-sentinel {
  width: 50%;
  visibility: hidden;
}

.tips {
  display: flex;
  bottom: 13px;
  position: absolute;
  align-self: center;

  .bottom-tip {
    width: 8px;
    height: 3px;
    background: #FFFFFF;
    opacity: 0.5;

    &:not(:first-of-type) {
      margin-left: 3px;
    }

    &.active {
      width: 20px;
      background: #3667D4;
      opacity: 1;
    }
  }
}
.action {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.3;
  max-height: 30%;
  min-height: 30px;
  &.mobile {
    display: none;
  }
  &.left {
    left: 16px;
  }

  &.right {
    right: 16px;
  }
  &:hover {
    opacity: 1;
  }
}
</style>
