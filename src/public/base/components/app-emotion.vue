<template>
  <span class="emotion">
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path v-if="type === 1" fill-rule="evenodd" clip-rule="evenodd"
            d="M10 15C9.44772 15 9 14.5523 9 14V11H6C5.44772 11 5 10.5523 5 10C5 9.44772 5.44772 9 6 9H9V6C9 5.44772 9.44772 5 10 5C10.5523 5 11 5.44772 11 6V9H14C14.5523 9 15 9.44772 15 10C15 10.5523 14.5523 11 14 11H11V14C11 14.5523 10.5523 15 10 15Z"
            fill="#C11616"/>
      <rect v-if="type === -1" x="5" y="9" width="10" height="2" rx="1" fill="#569C3E"/>
      <circle v-if="type === 0" cx="10" cy="10" r="4" fill="#777777"/>
      <path :d="negativePath" stroke="#569C3E" stroke-width="2"/>
      <path :d="positivePath" stroke="#C11616" stroke-width="2"/>
    </svg>
  </span>
</template>

<script>
const center = {
  x: 10,
  y: 10
}
const circle = 2 * Math.PI
const radius = 9

function round(num, digit) {
  const temp = Math.pow(10, digit);
  return Math.round(num * temp) / temp;
}

function getPoint(rate) {
  rate = 1 - rate
  return {
    x: round(radius * Math.cos(rate * circle) + center.x, 4),
    y: round(radius * Math.sin(rate * circle) + center.y, 4)
  };
}

export default {
  name: "app-emotion",
  props: ['value'], // number 0 ~ 1, e.g. 0.28 - 负面(<=0.35)，0.72 - 正面(>=0.65)
  computed: {
    type() {
      if (this.value <= 0.35) {
        return -1
      } else if (this.value >= 0.65) {
        return 1
      } else {
        return 0
      }
    },
    negativePath() {
      const value = Math.min(this.value + 0.01, 1)
      if (value >= 0.99) {
        return ''
      }
      const startPoint = getPoint(0.99)
      const point = getPoint(value)
      const largeArc = value < 0.5 ? 1 : 0
      return `M${startPoint.x} ${startPoint.y}A9 9 0 ${largeArc} 1 ${point.x} ${point.y}`
    },
    positivePath() {
      const value = Math.max(this.value - 0.01, 0)
      if (value <= 0.01) {
        return ''
      }
      const startPoint = getPoint(0.01)
      const point = getPoint(value)
      const largeArc = value > 0.5 ? 1 : 0
      return `M${startPoint.x} ${startPoint.y}A9 9 0 ${largeArc} 0 ${point.x} ${point.y}`
    }
  }
}
</script>

<style lang="less" scoped>
.emotion {
  display: inline-block;
  width: 20px;
  height: 20px;
  position: relative;

  > svg {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
