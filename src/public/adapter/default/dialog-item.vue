<script>
import {Dialog, Model, Position} from "../../dialogs/dialog";
import {PlatformService} from '../../platform/platform.service'
import {Platform} from '../../platform/platform'
import {getScrollParent, debounceTime} from '../../base/utils'

export default {
  name: "dialog-item",
  props: ['options'],
  di: {
    providers: [{
      provide: Dialog,
      useFactory() {
        return this.$options.propsData.options.instance
      }
    }],
    inject: {
      dialog: Dialog
    }
  },
  data() {
    return {
      transform: {x: 0, y: 0},
      listener: null,
      maxHeight: null,
      hide: false
    }
  },
  computed: {
    model() {
      const config = this.options.instance.config
      if (config && config.anchor) {
        return Model.positionByAnchor
      }
      if (config && config.model) {
        return config.model
      }
      return PlatformService.instance.platform === Platform.pc ? Model.float : Model.fillAvailable
    },
    position() {
      const config = this.options.instance.config
      if (config && config.position) {
        return config.position
      }
      return Position.bottom
    },
    enableOverlayClose() {
      if(!this.options.instance.config) {
        return true
      }
      if(this.options.instance.config['close-on-click-overlay'] !== undefined) {
        return this.options.instance.config['close-on-click-overlay']
      }
      if(this.options.instance.config.disableClose !== undefined) {
        return this.options.instance.config.disableClose
      }
      return true
    }
  },
  // https://vuejs.org/v2/guide/render-function.html#createElement-Arguments
  render(h) {
    let transform = ''
    if (this.model === Model.positionByAnchor) {
      transform = `translateX(${this.transform.x}px) translateY(${this.transform.y}px)`
    }
    return h('div', {
      class: {
        'dialog-container': true,
        [this.model]: true
      },
      on: {
        click: this.onOverlayClick
      },
      style: {
        'opacity': this.hide ? '0' : '1'
      }
    }, [
      h('div', {
        class: 'dialog-panel',
        ref: 'dialogPanel',
        style: {
          transform,
          maxHeight: this.maxHeight ? this.maxHeight + 'px' : null
        }
      }, [h(this.options.vueComponent)])
    ])
  },
  mounted() {
    this.options.instance.setOpen(this);
    this.fixPositionByAnchor()
  },
  updated() {
    this.fixPositionByAnchor()
  },
  destroyed() {
    if (this.listener) {
      document.body.removeEventListener('click', this.onBodyClick);
      this.listener.target.removeEventListener('scroll', this.listener.onScroll)
    }
  },
  methods: {
    onOverlayClick(event) {
      if (event.target === event.currentTarget) {
        if (this.enableOverlayClose) {
          this.options.instance.close()
        }
      }
    },
    onBodyClick(event) {
      if (
          this.enableOverlayClose &&
          event.target &&
          !this.$el.contains(event.target) &&
          document.body.querySelector('#app').contains(event.target)
      ) {
        this.options.instance.close()
      }
    },
    fixPositionByAnchor() {
      if (this.model !== Model.positionByAnchor) {
        return
      }
      if (!this.options.instance.config?.anchor) {
        this.transform = {x: 0, y: 0}
        return
      }
      if (!this.listener) {
        const target = getScrollParent(this.options.instance.config.anchor)
        this.listener = {
          target: target,
          onScroll: this.onAnchorMove.bind(this),
        }
        target.addEventListener('scroll', this.listener.onScroll)
        setTimeout(() => {
          document.body.addEventListener('click', this.onBodyClick, false);
        }, 0)
      }
      const anchor = this.options.instance.config.anchor.getBoundingClientRect() // a, ax, ay, aw, ah
      const self = this.$refs.dialogPanel?.getBoundingClientRect() // s, sx, sy, sw, sh
      if (!anchor || !self) {
        this.transform = {x: 0, y: 0}
        return
      }
      let translateX = 0
      let translateY = 0
      if ([Position.bottom, Position.bottomStrict].indexOf(this.position) >= 0) {
        // x = -((sx + sw/2) - (ax + aw/2))
        translateX = anchor.x + anchor.width / 2 - self.x - self.width / 2
        // y = -(sy - ay - ah)
        translateY = anchor.y + anchor.height - self.y
      }
      if (this.position === Position.top) {
        // x = -((sx + sw/2) - (ax + aw/2))
        translateX = anchor.x + anchor.width / 2 - self.x - self.width / 2
        // y = -(sy + sh - ay)
        translateY = anchor.y - self.y - self.height
      }
      if (this.position === Position.left) {
        // x = - (sx + sw - ax)
        translateX = anchor.x - self.x - self.width
        // y = - ((sy + sh/2) - (ay + ah/2))
        translateY = anchor.y + anchor.height / 2 - self.y - self.height / 2
      }
      if (this.position === Position.right) {
        // x = - (sx - ax - aw)
        translateX = anchor.x + anchor.width - self.x
        // y = - ((sy + sh/2) - (ay + ah/2))
        translateY = anchor.y + anchor.height / 2 - self.y - self.height / 2
      }
      const body = document.body.getBoundingClientRect()
      translateY = Math.min(body.height - self.height - self.y, translateY)
      translateY = Math.max(-self.y, translateY)
      translateX = Math.min(body.width - self.width - self.x, translateX)
      translateX = Math.max(-self.x, translateX)
      if (this.position === Position.bottomStrict) {
        translateY = Math.max(anchor.y + anchor.height - self.y, translateY)
        this.maxHeight = body.height - anchor.y - anchor.height - 4
      }
      if (Math.abs(translateX) > 1 || Math.abs(translateY) > 1) {
        const {x, y} = this.transform
        this.transform = {x: x + translateX, y: y + translateY}
      }
    },
    onAnchorMove() {
      this.fixPositionByAnchor()
    },

  }
}
</script>

<style lang="less" scoped>
.dialog-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  padding: 16px;

  .dialog-panel {
    max-height: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0px 3px 8px 0px rgba(255, 255, 255, 0.2);
  }

  &.float {
    align-items: center;
    background-color: rgba(0, 0, 0, 0.2);

    > * {
      margin: auto;
    }

    .dialog-panel {
      //padding: 24px;
    }
  }

  &.fill-available {
    background-color: rgba(255, 255, 255, 1);
    padding: 0;

    > * {
      flex: 1 1 0px;
    }

    .dialog-panel {
      border-radius: 0;

      .header {
        padding: 16px 48px;

        span.back {
          left: 18px;
          top: 18px;
        }
      }
    }
  }

  &.transparent {
    align-items: center;
    background-color: rgba(0, 0, 0, 0.2);

    > * {
      margin: auto;
    }

    .dialog-panel {
      background: none;
      box-shadow: none;

      > .header {
        display: none;
      }

      > .body {
        margin: 0;
      }
    }
  }

  &.position-by-anchor {
    pointer-events: none;
    align-items: center;

    > * {
      margin: auto;
    }

    .dialog-panel {
      pointer-events: auto;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
