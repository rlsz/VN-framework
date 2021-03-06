<script>
import {Dialog, Model, Position} from "../../dialogs/dialog";
import {DialogParent} from "../../dialogs/dialog-parent";
import {PlatformService} from "../../platform/platform.service";
import {Platform} from "../../platform/platform";
import {findParent, getAllScrollParent, getScrollParent, mouseLeftPress} from "../../base/utils";
import {ConfigService} from "../../config.service";
import {
  getContext,
  MouseClickContext, MouseDownContext, MouseUpContext, RealTimeMouseMoveContext,
  RealTimeScrollContext,
  ResizeContext,
  ScrollContext
} from "../../base/event-context";
import {Optional} from "../../di.service";
import {DialogContainerTarget} from "../../dialogs/dialog-container-target";

function round(num) {
  if (num >= 0) {
    return Math.round(num);
  } else {
    return -Math.round(-num);
  }
}

function calcTransform(anchorEl, targetEl, params) {
  if (!anchorEl || !targetEl) {
    return null;
  }
  const anchor = anchorEl.getBoundingClientRect(); // a, ax, ay, aw, ah
  const self = targetEl.getBoundingClientRect(); // s, sx, sy, sw, sh
  if (!anchor || !self) {
    return null;
  }
  let translateX = 0;
  let translateY = 0;
  let {position, offset, container} = params
  const body = container.getBoundingClientRect();
  if (position === Position.auto) {
    const gapLimit = Math.min(300, self.height)
    const gap = {
      bottom: body.y + body.height - anchor.y - anchor.height,
      right: body.x + body.width - anchor.x - anchor.width,
      top: anchor.y - body.y,
      left: anchor.x - body.x
    }
    if (gap.bottom > gapLimit) {
      position = Position.bottomStrict
    } else if (gap.top > gapLimit) {
      position = Position.topStrict
    } else if (gap.right > gapLimit) {
      position = Position.right
    } else if (gap.left > gapLimit) {
      position = Position.left
    } else {
      const maxGap = Math.max(gap.bottom, gap.right, gap.top, gap.left)
      if (gap.bottom === maxGap) {
        position = Position.bottomStrict
      } else if (gap.top === maxGap) {
        position = Position.topStrict
      } else if (gap.right === maxGap) {
        position = Position.right
      } else if (gap.left === maxGap) {
        position = Position.left
      } else {
        throw new Error('unknown error')
      }
    }
  }

  if ([Position.bottom, Position.bottomStrict].indexOf(position) >= 0) {
    // x = -((sx + sw/2) - (ax + aw/2))
    translateX = anchor.x + anchor.width / 2 - self.x - self.width / 2;
    // y = -(sy - ay - ah)
    translateY = anchor.y + anchor.height - self.y;
    translateY += offset
  }
  if ([Position.top, Position.topStrict].indexOf(position) >= 0) {
    // x = -((sx + sw/2) - (ax + aw/2))
    translateX = anchor.x + anchor.width / 2 - self.x - self.width / 2;
    // y = -(sy + sh - ay)
    translateY = anchor.y - self.y - self.height;
    translateY -= offset
  }
  if ([Position.left].indexOf(position) >= 0) {
    // x = - (sx + sw - ax)
    translateX = anchor.x - self.x - self.width;
    // y = - ((sy + sh/2) - (ay + ah/2))
    translateY = anchor.y + anchor.height / 2 - self.y - self.height / 2;
    translateX -= offset
  }
  if ([Position.right].indexOf(position) >= 0) {
    // x = - (sx - ax - aw)
    translateX = anchor.x + anchor.width - self.x;
    // y = - ((sy + sh/2) - (ay + ah/2))
    translateY = anchor.y + anchor.height / 2 - self.y - self.height / 2;
    translateX += offset
  }

  translateY = Math.min(body.height + body.y - self.height - self.y, translateY)
  translateY = Math.max(body.y - self.y, translateY)
  translateX = Math.min(body.width + body.x - self.width - self.x, translateX)
  translateX = Math.max(body.x - self.x, translateX)

  let maxHeight = null;
  if (position === Position.bottomStrict) {
    translateY = Math.max(anchor.y + anchor.height - self.y + offset, translateY);
    maxHeight = body.height - anchor.y - anchor.height - 4 - offset;
  }
  if (position === Position.topStrict) {
    translateY = Math.min(anchor.y - self.y - self.height + offset, translateY);
    maxHeight = anchor.y - body.y - 4 - offset;
  }
  // if (position === Position.leftStrict) {
  //
  // }
  // if (position === Position.rightStrict) {
  //
  // }

  translateX = round(translateX);
  translateY = round(translateY);
  return {x: translateX, y: translateY, maxHeight, position};
}

export default {
  name: "dialog-item",
  props: ["options"],
  di: {
    providers: [
      {
        provide: Dialog,
        useFactory() {
          return this.$options.propsData.options.instance;
        }
      },
      {
        provide: DialogParent,
        useFactory() {
          return this.$options.propsData.options.parent;
        }
      }
    ],
    inject: {
      dialog: Dialog,
      configService: ConfigService,
      parent: Optional(DialogParent)
    },
  },
  data() {
    return {
      transform: {x: 0, y: 0},
      movingOffset: null,
      transformPointer: {x: 0, y: 0, position: Position.bottom},
      listener: null,
      maxHeight: null,
      hide: false,
      fixPosition: {left: '0', right: '0', top: '0', bottom: '0'},
      subs: []
    };
  },
  computed: {
    model() {
      const config = this.options.instance.config;
      if (config && config.anchor) {
        return Model.positionByAnchor;
      }
      if (config && config.model) {
        return config.model;
      }
      return PlatformService.instance.platform === Platform.pc
          ? Model.float
          : Model.fillAvailable;
    },
    theme() {
      return this.options.instance.config?.theme || '';
    },
    position() {
      const config = this.options.instance.config;
      if (config && config.position) {
        return config.position;
      }
      return Position.auto;
    },
    calcTransformParams() {
      const config = this.options.instance.config;
      return {
        position: this.position,
        offset: config?.offset || 0,
        container: config?.container || document.body
      }
    },
    enableOverlayClose() {
      if (this.options.instance.config) {
        if (this.options.instance.config["close-on-click-overlay"] !== undefined) {
          return this.options.instance.config["close-on-click-overlay"];
        }
        if (this.options.instance.config.disableClose !== undefined) {
          return !this.options.instance.config.disableClose;
        }
      }
      return this.model === Model.positionByAnchor || !this.configService?.dialogDisableClose;
    }
  },
  // https://vuejs.org/v2/guide/render-function.html#createElement-Arguments
  render(h) {
    let transform = "",
        transformPointer = "";
    if (this.model === Model.positionByAnchor) {
      transform = `translateX(${this.transform.x}px) translateY(${this.transform.y}px)`;
      transformPointer = `translateX(${this.transformPointer.x}px) translateY(${this.transformPointer.y}px)`;
    }
    if (this.model === Model.fixed) {
      if (this.movingOffset) {
        transform = `translateX(${this.transform.x + this.movingOffset.x}px) translateY(${this.transform.y + this.movingOffset.y}px)`;
      } else {
        transform = `translateX(${this.transform.x}px) translateY(${this.transform.y}px)`;
      }
    }
    return h(
        "div",
        {
          class: {
            "dialog-container": true,
            [this.model]: true,
            [this.theme]: true
          },
          on: {
            click: this.onOverlayClick,
          },
          style: {
            opacity: this.hide ? "0" : "1",
            ...this.fixPosition
          },
          attrs: {
            id: this.dialog.id,
          }
        },
        [
          h(
              "div",
              {
                class: "dialog-panel",
                ref: "dialogPanel",
                style: {
                  transform,
                  maxHeight: this.maxHeight ? this.maxHeight + "px" : null,
                },
              },
              [
                this.model === Model.fixed ? (
                    <app-drag-icon class={`dialog-drag-pointer ${this.movingOffset ? 'dragging' : ''}`}
                                   on-mousedown={this.beginMove}
                    ></app-drag-icon>
                ) : null,
                h(this.options.vueComponent)
              ]
          ),
          transformPointer
              ? h("i", {
                class: {
                  "dialog-anchor-pointer": true,
                  [this.transformPointer.position]: true,
                },
                ref: "dialogAnchorPointer",
                style: {
                  transform: transformPointer,
                },
              })
              : null
        ]
    );
  },
  mounted() {
    this.options.instance.setOpen(this);
    this.watchPosition()
  },
  updated() {
    setTimeout(() => {
      this.fixPositionByAnchor();
    }, 0)
  },
  destroyed() {
    this.subs.forEach(c => c.unsubscribe())
    this.subs = []
  },
  methods: {
    onOverlayClick(event) {
      if (event.target === event.currentTarget) {
        if (this.enableOverlayClose) {
          this.options.instance.close();
        }
      }
    },
    watchBodyClick() {
      const mouseClickContext = getContext(MouseDownContext)
      let currentEvent = window.event
      this.subs.push(
          mouseClickContext.events.subscribe(ev => {
            if (currentEvent && ev === currentEvent) {
              currentEvent = null
              return
            }
            this.onBodyClick(ev)
          })
      )
    },
    onBodyClick(event) {
      if (
          this.enableOverlayClose &&
          event.target &&
          !this.$el.contains(event.target)
      ) {
        if (document.body.querySelector("#app").contains(event.target)) {
          this.options.instance.close();
        }
        if (document.body.querySelector(".dialog-root").contains(event.target)) {
          /**
           * https://stackoverflow.com/questions/56680928/compare-order-of-two-html-elements/56681103
           * https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
           */
          if (event.target.compareDocumentPosition(this.$el) & Node.DOCUMENT_POSITION_FOLLOWING) {
            this.options.instance.close();
          }
        }
      }
    },
    fixPositionByAnchor() {
      if (this.model !== Model.positionByAnchor) {
        return;
      }
      if (!this.options.instance.config?.anchor) {
        this.transform = {x: 0, y: 0};
        return;
      }
      const transform = calcTransform(
          this.options.instance.config.anchor,
          this.$refs.dialogPanel,
          this.calcTransformParams
      );
      if (!transform) {
        this.transform = {x: 0, y: 0};
        return;
      }
      if (transform.maxHeight !== this.maxHeight) {
        this.maxHeight = transform.maxHeight;
      }
      if (Math.abs(transform.x) > 1 || Math.abs(transform.y) > 1) {
        const {x, y} = this.transform;
        this.transform = {x: x + transform.x, y: y + transform.y};
      }

      const transformPointer = calcTransform(
          this.options.instance.config.anchor,
          this.$refs.dialogAnchorPointer,
          {...this.calcTransformParams, position: transform.position}
      );
      if (!transformPointer) {
        this.transformPointer = {x: 0, y: 0, position: Position.bottom};
        return;
      }
      if (
          Math.abs(transformPointer.x) > 1 ||
          Math.abs(transformPointer.y) > 1
      ) {
        const {x, y} = this.transformPointer;
        this.transformPointer = {
          x: x + transformPointer.x,
          y: y + transformPointer.y,
          position: transformPointer.position
        };
      }
    },
    watchPosition() {
      const anchor = this.options.instance.config?.anchor
      if (this.model === Model.positionByAnchor && anchor) {
        this.subs.push(
            ...getAllScrollParent(anchor).map(c => getContext(RealTimeScrollContext, c).events.subscribe(ev => this.fixPositionByAnchor())),
            getContext(ResizeContext).events.subscribe(ev => this.fixPositionByAnchor())
        )
        this.watchBodyClick()
        this.fixPositionByAnchor()
      }
      if (this.model === Model.fillAvailable) {
        const container = this.options.instance.config?.container || this.parent?.$injector.get(Optional(DialogContainerTarget))
        if(container && container !== document.body) {
          const calcPosition = () => {
            const {left, top, right, bottom} = container.getBoundingClientRect()
            const {
              left: bodyLeft,
              top: bodyTop,
              right: bodyRight,
              bottom: bodyBottom
            } = document.body.getBoundingClientRect()
            this.fixPosition = {
              left: Math.max(round(left), 0) + 'px',
              top: Math.max(round(top), 0) + 'px',
              right: Math.max(round(bodyRight - right), 0) + 'px',
              bottom: Math.max(round(bodyBottom - bottom), 0) + 'px'
            }
          }
          this.subs.push(
              ...getAllScrollParent(container).map(c => getContext(RealTimeScrollContext, c).events.subscribe(ev => calcPosition())),
              getContext(ResizeContext).events.subscribe(ev => calcPosition())
          )
          this.watchBodyClick()
          calcPosition()
        }
      }
      if (this.model === Model.fixed) {
        // this.transform = { x: 100, y: 100 };
      }
    },
    beginMove(start) {
      const mouseMove = getContext(RealTimeMouseMoveContext)
      const mouseUp = getContext(MouseUpContext)
      this.movingOffset = {x: 0, y: 0}
      const endMove = () => {
        subMouseMove.unsubscribe()
        subMouseUp.unsubscribe()
        this.transform.x += this.movingOffset.x
        this.transform.y += this.movingOffset.y
        this.movingOffset = null
      }

      const subMouseMove = mouseMove.events.subscribe(ev => {
        if (mouseLeftPress(ev)) {
          this.movingOffset.x = ev.clientX - start.clientX
          this.movingOffset.y = ev.clientY - start.clientY
        } else if (this.movingOffset) {
          endMove()
        }
      })
      const subMouseUp = mouseUp.events.subscribe(ev => {
        endMove()
      })
    }
  },
};
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

      > * {
        flex: 1 1 0px;
        border: 1px dashed rgba(0, 0, 0, 0.1)
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

  &.fixed {
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

i.dialog-anchor-pointer {
  display: inline-flex;
  align-items: center;

  &:after {
    cursor: pointer;
    content: "";
    border: solid rgba(0, 0, 0, 0.1);
    border-width: 0 1px 1px 0;
    padding: 2px;
    background: white;
  }

  &.top:after,
  &.topStrict:after {
    margin-bottom: -3px;
    transform: rotate(45deg) translateY(-2px);
  }

  &.bottom:after,
  &.bottomStrict:after {
    margin-top: -3px;
    transform: rotate(-135deg) translateY(-2px);
  }

  &.left:after,
  &.leftStrict:after {
    margin-right: -3px;
    transform: rotate(-45deg);
  }

  &.right:after,
  &.rightStrict:after {
    margin-left: -3px;
    transform: rotate(135deg);
  }
}

.dialog-drag-pointer {
  position: absolute;
  z-index: 2;
  //cursor: move !important;
  cursor: grab !important;
  width: 24px !important;
  height: 24px !important;
  margin: 2px;
  align-self: center;

  opacity: 0;

  &:hover {
    opacity: 1;
  }

  &.dragging {
    cursor: grabbing !important;
  }
}
</style>
