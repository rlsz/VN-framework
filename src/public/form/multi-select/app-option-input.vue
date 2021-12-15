<template>
  <span class="app-option-input" v-if="!editing" @click="onAdd"><slot>+添加</slot></span>
  <span class="app-option-input fix-line flex vertical" v-else>
    <input ref="input"
           v-model="text"
           :placeholder="placeholder || '请输入内容'"
           @input="triggerSearch"
           @focus="onFocus"
           @keyup.enter="triggerSearch"/>
  </span>
</template>

<script>
import {MultiSelectService} from "./multi-select.service";
import {DialogService} from "../../dialogs/dialog.service";
import OptionsDialog from './options-dialog'
import {Position} from "../../dialogs/dialog";
import {getContext, MouseClickContext} from "../../base/event-context";
import {debounceTime} from "@/public/base";

export default {
  name: "app-option-input",
  props: ['placeholder'],
  di: {
    inject: {
      mss: MultiSelectService,
      ds: DialogService
    }
  },
  data() {
    return {
      text: '',
      editing: false,
      optionsDialog: null,
      subs: [],
      triggerSearch: debounceTime(() => {
        this.onFocus(this.$refs.input)
      })
    }
  },
  mounted() {
    const mouseClickContext = getContext(MouseClickContext)
    this.subs.push(
        mouseClickContext.events.subscribe(this.onBodyClick)
    )
  },
  destroyed() {
    this.subs.forEach(c => c.unsubscribe())
    this.subs = []
    if(this.optionsDialog) {
      this.optionsDialog.close()
    }
  },
  methods: {
    onBodyClick(event) {
      if(
          this.optionsDialog &&
          event.target &&
          document.body.contains(event.target) &&
          !this.$el.contains(event.target) &&
          !this.optionsDialog._vm.$el.contains(event.target)
      ) {
        this.optionsDialog.close()
      }
    },
    showDialog(anchor) {
      if(!this.optionsDialog) {
        this.optionsDialog = this.ds.open(OptionsDialog, {
          mss: this.mss,
          anchor,
          'close-on-click-overlay': false,
          position: Position.bottomStrict,
          offset: 3
        })
        this.optionsDialog.afterClosed().then(item => {
          this.editing = false
          this.optionsDialog = null
          if(item) {
            this.mss.onSelectOption(item)
          }
        })
      }
    },
    onFocus(e) {
      this.mss.search(this.text)
      this.showDialog(e.target)
    },
    onAdd() {
      this.editing = true
      this.$nextTick(() => {
        if (this.$refs.input) {
          this.$refs.input.focus()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.app-option-input {
  font-size: 14px;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  text-align: LEFT;
  color: #0d2b5e;

  margin: 4px 5px;
  cursor: pointer;
  input {
    outline: none;
    background: #FFFFFF;
    border: 1px solid #409EFF;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 6px 12px;
  }
}
.fix-line {
  flex: 0 0 100%;
}
</style>
