<template>
  <div class="app-select flex inline cross-center" @click="onClick">
    <template v-if="ass.isEmpty()">
      <input v-if="query" class="app-select_filter empty" :placeholder="placeholder" v-model="filterText"></input>
      <span v-else class="app-select_placeholder">{{ placeholder }}</span>
    </template>
    <template v-else-if="ass.multiple">
      <span class="multiple-selections fill-content flex wrap">
        <slot name="label"
              v-for="(item,index) in ass.valueOptions"
              v-bind:value="item"
              v-bind:index="index"
              v-bind:context="ass"
        >
          <span class="flex">
            <span v-limit-line>{{ ass.getLabel(item) }}</span>
            <i class="close" @click.stop="ass.onSelectOption(item)"></i>
          </span>
        </slot>
        <input v-if="query" class="app-select_filter multiple_mode" v-model="filterText"></input>
      </span>
    </template>
    <template v-else>
      <input v-if="query"
             class="app-select_filter"
             :placeholder="ass.getLabel(ass.valueOptions[0])"
             v-model="filterText"
      ></input>
      <span v-else v-limit-line>{{ ass.getLabel(ass.valueOptions[0]) }}</span>
    </template>

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
import {debounceTime} from "../../base/utils";

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
    'multipleLimit',
    'query'
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
  data() {
    return {
      filterText: '',
      queryRef: debounceTime((keyword) => {
        this.ass.getData(keyword)
      }, 200),
      dropdown: null
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
  watch: {
    filterText(val, oldVal) {
      this.queryRef(val)
    },
    'ass.allOptions'(val) {
      if(this.dropdown) {
        const actions = val.map(c => {
          return {
            text: this.ass.getLabel(c),
            handler: dialog => {
              dialog.close()
              this.ass.onSelectOption(c)
            },
            active: this.ass.isActive(c)
          }
        })
        this.dropdown.config.actions = actions
      }
    }
  },
  methods: {
    onClick(ev) {
      const anchor = ev.currentTarget
      const {width} = anchor.getBoundingClientRect()
      this.ass.getData(this.filterText).then(() => {
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
        this.dropdown = this.ds.open(ActionsDialog, {
          anchor,
          offset: 2,
          actions,
          minWidth: width + 'px',
          maxWidth: Math.max(width, 300) + 'px',
          limitLine: 1
        })
        this.dropdown.afterClosed().finally(() => {
          this.dropdown = null
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

  > *:not(input) {
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
    cursor: auto;
    //max-width: calc(100% - 26px);

    i.close {
      margin-left: 4px;
      width: 8px;
      height: 8px;
    }
  }
}
input.app-select_filter {
  font-size: 14px;
  line-height: 22px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #323335;

  border-radius: 4px;
  border: none;
  text-overflow: ellipsis;
  &.multiple_mode {
    width: 20px;
    flex: 1 0 auto;
    &:focus {
      width: 50px;
    }
  }

  &:focus {
    outline-offset: 0px;
    //outline: 1px solid #3667D4;
    outline: none;
  }
  &::-ms-clear {
    display: none; // capability issue for ie 11, hide default clear icon
  }

  &:not(.empty):not(:focus) {
    &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: #323335;
      opacity: 1; /* Firefox */
    }

    &:-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: #323335;
    }

    &::-ms-input-placeholder { /* Microsoft Edge */
      color: #323335;
    }
  }
}
</style>
