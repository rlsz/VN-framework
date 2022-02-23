<template>
  <div class="app-select flex inline cross-center" @click="onClick">
    <span v-if="ass.multiple" class="multiple-selections flex wrap">
      <slot name="label"
            v-for="(item,index) in ass.valueOptions"
            v-bind:value="item"
            v-bind:index="index"
      >
        <span v-limit-line>{{ ass.getLabel(item) }}</span>
      </slot>
    </span>
    <span v-else-if="!ass.isEmpty()" v-limit-line>{{ ass.getLabel(ass.valueOptions[0]) }}</span>
    <span v-else class="app-select_placeholder">{{ placeholder }}</span>
    <i class="arrow down"></i>
  </div>
</template>

<script>
import {DialogService} from "../../dialogs/dialog.service";
import {Position} from "../../dialogs/dialog";
import ActionsDialog from "../../base/components/actions-dialog";
import {FormControlService, FormModel, FormModelService} from "../form-model";
import {Optional} from "../../di.service";
import {FormInputAdapter} from "../../adapter/element/form-input-adapter";
import {AppSelectService} from "./app-select.service";

export default {
  name: "app-select",
  props: [
    'placeholder',
    'options',
    'remoteMethod',
    'value',
    'labelKey',
    'valueKey',
    'idKey',
    'multiple',
    'multipleLimit'
  ],
  di: {
    providers: [FormControlService, FormInputAdapter, AppSelectService],
    inject: {
      ds: DialogService,
      formInput: FormInputAdapter,
      fms: Optional(FormModelService),
      ass: AppSelectService
    }
  },
  computed: {
    editable() {
      if (this.fms?.formModel === FormModel.detail) {
        return false
      }
      if (this.$listeners.input) {
        return true
      }
      return false
    }
  },
  methods: {
    onClick(ev) {
      const anchor = ev.currentTarget
      const {width} = anchor.getBoundingClientRect()
      this.ass.getData().then(() => {
        return this.ass.allOptions.map(c => {
          return {
            text: this.ass.getLabel(c),
            handler: dialog => {
              dialog.close()
              this.ass.onSelectOption(c)
            },
            active: this.ass.isActive(c)
          }
        })
      }).then(actions => {
        this.ds.open(ActionsDialog, {
          anchor,
          position: Position.bottom,
          offset: 2,
          actions,
          minWidth: width + 'px',
          maxWidth: Math.max(width, 300) + 'px',
          limitLine: 1
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.multiple-selections {
  max-width: 100%;
  min-width: 0px;
  > * {
    background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
    height: 24px;
    padding: 0 8px;
    line-height: 22px;
    font-size: 12px;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    margin: 2px 3px 2px 3px;
  }
}
</style>
