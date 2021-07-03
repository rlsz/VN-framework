<template>
  <span class="app-option-input" v-if="!editing" @click="onAdd"><slot>+添加</slot></span>
  <span class="app-option-input" v-else>
    <input ref="input"
           v-model="text"
           :placeholder="placeholder || '请输入内容'"
           @focus="onFocus"
           @keyup.enter="onEnter"/>
  </span>
</template>

<script>
import {MultiSelectService} from "./multi-select.service";
import {DialogService} from "../../dialogs/dialog.service";
import OptionsDialog from './options-dialog'
import {Position} from "../../dialogs/dialog";

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
      optionsDialog: null
    }
  },
  mounted() {
    document.body.addEventListener('click', this.onBodyClick, false);
  },
  destroyed() {
    document.body.removeEventListener('click', this.onBodyClick);
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
          position: Position.bottomStrict
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
      this.showDialog(e.target)
    },
    onAdd() {
      this.editing = true
      this.$nextTick(() => {
        if (this.$refs.input) {
          this.$refs.input.focus()
        }
      })
    },
    onEnter(e) {
      this.mss.search()
      this.onFocus(e.target)
    }
  }
}
</script>

<style lang="less" scoped>
.app-option-input {
  font-family: PingFang SC;
  font-size: 14px;
  line-height: 20px;
  color: #6257DC;
  cursor: pointer;

  margin-right: 10px;
  margin-bottom: 4px;

  input {
    background: #FFFFFF;
    border: 1px solid #0D2B5E;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 6px 12px;
  }
}
</style>
