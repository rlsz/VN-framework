<template>
  <div @mousemove="move" class="scale-bar">
    <i @click="onMinus" class="minus-circle"></i>
    <span class="bar" :style="{width:barWidth+'px'}">
        <span
            :style="{ left: scalePercentage }"
            @mousedown="start"
            class="point"
        ></span>
    </span>
    <i @click="onPlus" class="plus-circle"></i>
  </div>
</template>
<script>
import {SimpleSubject} from '../utils';

const TraceType = {
  start: 1,
  move: 2,
  end: 3,
  cancel: 4
}
export default {
  name: 'app-scale-bar',
  props: {
    value: {default: 0},
  },
  data() {
    return {
      barWidth: 300,
      movingOffset: 0,
      /**
       interface Trace {
            type: TraceType;
            x: number;
            y: number;
        }
       */
      movingTrace: new SimpleSubject(),
      sub: null
    }
  },
  computed: {
    scale() {
      return Math.max(
          0,
          Math.min(
              1,
              this.value + this.movingOffset / this.barWidth
          )
      );
    },
    scalePercentage() {
      return this.scale * 100 + '%';
    }
  },
  methods: {
    onMinus() {
      this.$emit('input', Math.max(0, this.value - 0.1));
    },
    onPlus() {
      this.$emit('input', Math.min(1, this.value + 0.1));
    },
    start(e) {
      e.preventDefault();
      this.movingTrace.next({
        type: TraceType.start,
        x: e.clientX,
        y: e.clientY
      });
    },
    move(e) {
      e.preventDefault();
      if (this.mouseLeftPress(e)) {
        this.movingTrace.next({
          type: TraceType.move,
          x: e.clientX,
          y: e.clientY
        });
      } else if (this.movingOffset) {
        this.movingTrace.next({
          type: TraceType.cancel,
          x: e.clientX,
          y: e.clientY
        });
      }
    },
    end(e) {
      e.preventDefault();
      if (this.$el.contains(e.target)) {
        this.movingTrace.next({
          type: TraceType.end,
          x: e.clientX,
          y: e.clientY
        });
      } else if (this.movingOffset) {
        this.movingTrace.next({
          type: TraceType.cancel,
          x: e.clientX,
          y: e.clientY
        });
      }
    },
    mouseLeftPress(evt) {
      evt = evt || window.event;
      if ('buttons' in evt) {
        return evt.buttons === 1;
      }
      const button = evt.which || evt.button;
      return button === 1;
    }
  },
  mounted() {
    document.body.addEventListener('mouseup', this.end, false);
    let start;
    this.sub = this.movingTrace.subscribe((e) => {
      // if (e.type === TraceType.start || start) {
      //     console.log(e.type);
      // }

      if (e.type === TraceType.start) {
        start = e;
      } else if (e.type === TraceType.end && start) {
        this.$emit('input', this.scale);
        start = undefined;
        this.movingOffset = 0;
      } else if (e.type === TraceType.move && start) {
        this.movingOffset = e.x - start.x;
      } else if (e.type === TraceType.cancel && start) {
        start = undefined;
        this.movingOffset = 0;
      }
    });
  },
  destroyed() {
    document.body.removeEventListener('mouseup', this.end);
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

</script>
<style lang="less" scoped>
.scale-bar {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  height: 50px;

  .bar {
    position: relative;
    display: flex;
    align-items: center;
    height: 5px;
    margin: 0 18px;
    background: rgba(255, 198, 179, 1);
    border-radius: 3px;

    .point {
      position: absolute;
      left: 0%;
      width: 16px;
      height: 16px;
      background: rgba(255, 114, 65, 1);
      border-radius: 50%;
      box-shadow: 0 0 4px 0 rgba(255, 114, 65, 0.5);
      content: '';
    }
  }
}
</style>
