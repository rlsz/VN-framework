<template>
  <span v-if="refreshFlag"></span>
  <el-select
      :loading="loading"
      v-bind="{filterable: !!remoteMethod, remote: !!remoteMethod, 'reserve-keyword': !!remoteMethod, ...$props, ...$attrs, asyncOptions: undefined, valueKey: idKey || valueKey}"
      v-on="{...$listeners}"
      v-el-select-modify
      :remote-method="customRemoteMethod"
      v-else-if="editable"
  >
    <slot v-for="(item,index) in allOptions" v-bind:value="item" v-bind:index="index">
      <el-option
          :key="getId(item)"
          :label="getLabel(item)"
          :value="getValue(item)"
      ></el-option>
    </slot>
  </el-select>
  <span v-else-if="multipleProp" class="multiple-selections">
    <slot name="value"
          v-for="(item,index) in value"
          v-bind:value="item"
          v-bind:index="index"
          v-bind:optionsMap="optionsMap"
    >
      <span>{{getLabel(item)}}</span>
    </slot>
  </span>
  <span v-else-if="optionsMap[value]">
    <slot name="value" v-bind:value="optionsMap[value]">{{getLabel(optionsMap[value])}}</slot>
  </span>
  <span v-else>{{value}}</span>
</template>

<script>
import {FORM_MODEL, FormModel} from "../../form/form-model";
import {Optional} from "../../di.service";
import {Distinct} from "../../base/utils";

export default {
  name: "async-select",
  props: ['asyncOptions', 'value', 'valueKey', 'labelKey', 'idKey', 'multiple', 'remoteMethod'], // asyncOptions: Promise instance
  di: {
    inject: {
      formModel: Optional(FORM_MODEL)
    }
  },
  data() {
    return {
      options: [],
      loading: false,
      refreshFlag: false
    }
  },
  computed: {
    optionsMap() {
      return this.options.reduce((obj, item) => {
        obj[this.getId(item)] = item
        return obj
      }, {})
    },
    multipleProp() {
      return this.multiple === '' ? true : this.multiple;
    },
    editable() {
      if(this.formModel === FormModel.detail) {
        return false
      }
      if(this.$listeners.input) {
        return true
      }
      return false
    },
    valueOptions() {
      if (this.multiple === false) {
        return this.value ? [this.value] : []
      } else {
        return this.value
      }
    },
    allOptions() {
      if (this.idKey || this.valueKey) {
        return Distinct(
            [].concat(this.options || [], this.valueOptions || []),
            (a, b) => this.getId(a) === this.getId(b)
        )
      } else {
        return this.options
      }
    }
  },
  watch: {
    asyncOptions(val) {
      this.getData()
    },
    value(newVal, oldVal) {
      if(newVal !== oldVal) {
        this.refresh()
      }
    }
  },
  created() {
    this.options = this.valueOptions
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      Promise.resolve(this.asyncOptions).then(data => {
        this.options = data || []
      }).finally(() => {
        this.loading = false
      })
    },
    getValue(val) {
      if(this.valueKey) {
        return val[this.valueKey]
      } else {
        return val
      }
    },
    getLabel(val) {
      if(this.labelKey) {
        return val[this.labelKey]
      } else {
        return val
      }
    },
    getId(val) {
      if(this.idKey) {
        return val[this.idKey]
      } else if (this.valueKey) {
        return val[this.valueKey]
      } else {
        return val
      }
    },
    customRemoteMethod(keyword) {
      this.loading = true
      Promise.resolve(this.remoteMethod(...arguments)).then(data => {
        this.options = data
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * el-select在value发生变化时getOption方法得到的newOption的currentLabel为空，导致el-tag显示错误，
     * 通过refresh强制销毁重建可以恢复正常
     *
     * 这个修改会导致的变化：
     * 旧：
     *  1、多选输入框获取焦点后不会出现下拉框
     *  2、输入关键词后触发远程搜索，然后出现下拉框，失去焦点后下拉框消失
     *  3、删除关键词不会导致下拉框消失
     *  4、选中下拉框选项后下拉框和输入内容保留，可以继续选择其他选项
     *  5、从外部修改v-model绑定的属性时可能导致el-tag显示错误
     * 新：
     *  1、同上
     *  2、同上
     *  3、同上
     *  4、选中下拉框选项后el-select会被重置，输入内容消失、下拉框收起，但下拉框选项内容保留
     *  5、修复el-tag显示错误的问题
     *
     *  已与产品确认过，新的交互方式要优于旧的交互方式，所有多选输入组件可以使用本组件代替
     */
    refresh() {
      this.refreshFlag = true
      this.$nextTick(() => {
        this.refreshFlag = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.multiple-selections {
  > * {
    background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
    display: inline-block;
    height: 24px;
    padding: 0 8px;
    line-height: 22px;
    font-size: 12px;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    box-sizing: border-box;
    white-space: nowrap;
    margin: 2px 3px 2px 3px;
  }
}
</style>
