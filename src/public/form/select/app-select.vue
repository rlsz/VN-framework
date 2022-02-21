<template>
  <div class="app-select flex inline cross-center" @click="onClick">
    <span class="app-select_placeholder">{{placeholder}}</span>
    <i class="arrow down"></i>
  </div>
</template>

<script>
import {DialogService} from "../../dialogs/dialog.service";
import {Position} from "../../dialogs/dialog";
import ActionsDialog from "../../base/components/actions-dialog";

export default {
  name: "app-select",
  props: ['placeholder', 'options'],
  di: {
    inject: {
      ds: DialogService
    }
  },
  methods: {
    onClick(ev) {
      const anchor = ev.currentTarget
      const { width } = anchor.getBoundingClientRect()
      console.log('min-width', width + 'px')
      console.log('max-width', Math.max(width - 32, 300) + 'px')
      Promise.resolve(this.options).then(options => {
        // return []
        return options.map(c => {
          return {
            text: c.label,
            handler: dialog => {
              dialog.close()
              this.selectOption(c)
            }
          }
        })
      }).then(options => {
        this.ds.open(ActionsDialog, {
          anchor,
          position: Position.bottom,
          offset: 2,
          actions: options
        })
      })
    },
    selectOption(option) {
      console.log(option.label)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
