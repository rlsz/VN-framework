<template>
  <div class="progress-bar-dialog">
    <span>{{config.desc}}</span>
    <span class="bar" :style="{width:barWidth+'px'}">
        <span :style="{ left: scalePercentage }" class="unfinished"></span>
    </span>
    <i class="close" @click="dialog.close()"></i>
  </div>
</template>

<script>
import {Dialog} from "../../dialogs/dialog";

export default {
  di: {
    inject: {
      dialog: Dialog
    }
  },
  data() {
    return {
      barWidth: 300,
      percentage: 0,
      sub: null
    }
  },
  computed: {
    config() {
      return this.dialog.config || {}
    },
    scalePercentage() {
      return Math.max(this.percentage, 0.01) * 100 + '%';
    }
  },
  created() {
    if(this.config.data) {
      this.sub = this.config.data.subscribe(p => {
        this.percentage = p
      })
    }
  },
  destroyed() {
    if(this.sub) {
      this.sub.unsubscribe()
    }
  }
}
</script>

<style lang="less" scoped>
.progress-bar-dialog {
  opacity: 0.6;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  .bar {
    position: relative;
    display: flex;
    align-items: center;
    height: 5px;
    margin: 0 18px;
    background: rgba(255, 114, 65, 1);
    border-radius: 3px;

    .unfinished {
      position: absolute;
      left: 0%;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(246, 247, 250, 1);
    }
  }
}
i.close {
  width: 10px;
  height: 10px;
}
</style>
