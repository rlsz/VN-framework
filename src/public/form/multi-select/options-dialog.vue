<!--<template>-->
<!--  <div class="options-dialog scroll" :style="{minWidth: minWidth+'px'}">-->
<!--    <span class="option" :class="{active: mss.isActive(item)}" v-for="(item,index) in options" :key="'option-index-'+index" @click="submit(item)">-->
<!--      {{item.label}}-->
<!--    </span>-->
<!--    <dropdownContent></dropdownContent>-->
<!--  </div>-->
<!--</template>-->

<script>
import {Dialog} from "../../dialogs/dialog";
import {MultiSelectService} from "./multi-select.service";

export default {
  di: {
    providers: [{
      provide: MultiSelectService,
      useFactory(injector) {
        return injector.get(Dialog).config?.mss || null
      }
    }],
    inject: {
      dialog: Dialog,
      mss: MultiSelectService
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
      return this.mss.allOptions
    },
    minWidth() {
      if(!this.config.anchor) {
        return 0
      }
      const {width} = this.config.anchor.getBoundingClientRect()
      return width
    }
  },
  render(h) {
    const options = this.mss.allOptions.map((c, i) => this.mss.dropdownOption({
      value: c,
      index: i,
      active: this.mss.isActive(c)
    }))
    return h('div', {
      class: 'options-dialog scroll',
      style: {
        minWidth: this.minWidth+'px'
      }
    }, options)
  },
  watch: {
    options() {
      this.$nextTick(() => {
        this.dialog._vm.fixPositionByAnchor()
      })
    }
  },
  // beforeCreate() {
  //   const _this = this
  //   this.$options.components.dropdownContent = {
  //     render(h) {
  //       // console.log('*****', _this.mss.dropdownOption)
  //       // return _this.mss.dropdownOption
  //       return h('div', null, _this.mss.dropdownOption)
  //     },
  //     mounted() {
  //       console.log(this.$el)
  //     }
  //   }
  // },
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
