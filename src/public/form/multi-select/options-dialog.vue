<template>
  <div class="options-dialog scroll" :style="{minWidth: minWidth+'px'}">
    <span class="option" :class="{active: config.mss.isActive(item)}" v-for="(item,index) in options" :key="'option-index-'+index" @click="submit(item)">
      {{item.label}}
    </span>
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
    }
  },
  computed: {
    config() {
      return this.dialog.config
    },
    options() {
      return this.config.mss.allOptions
    },
    minWidth() {
      if(!this.config.anchor) {
        return 0
      }
      const {width} = this.config.anchor.getBoundingClientRect()
      return width
    }
  },
  watch: {
    options() {
      this.$nextTick(() => {
        this.dialog._vm.fixPositionByAnchor()
      })
    }
  },
  created() {
  },
  methods: {
    submit(item) {
      this.dialog.close(item)
    }
  }
}
</script>

<style lang="less" scoped>
.options-dialog {
  background: #FFFFFF;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
  border-radius: 4px;

  font-family: PingFang SC;
  font-size: 16px;
  line-height: 22px;
  color: #0D2B5E;
  padding: 0 12px;

  flex-basis: auto;
  > .option {
    padding: 9px 2px;
    border-radius: 4px;
    border-bottom: 1px solid #E9EEF8;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
    &.active {
      color: #6257DC;
      &:after {
        cursor: pointer;
        content: "";
        margin-left: 8px;
        margin-right: 8px;
        border: solid #6257DC;
        border-width: 0 1px 1px 0;
        padding: 4px 2px;
        transform: rotate(45deg) translateY(-2px);
        margin-left: auto;
      }
    }
  }
}
</style>
