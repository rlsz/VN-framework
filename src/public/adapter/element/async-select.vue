<template>
  <el-select
      :loading="loading"
      v-bind="{...$props, ...$attrs, asyncOptions: undefined, valueKey: idKey || valueKey}"
      v-on="{...$listeners}"
      v-if="editable"
  >
    <slot v-for="(item,index) in options" v-bind:value="item" v-bind:index="index">
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

export default {
  name: "async-select",
  props: ['asyncOptions', 'value', 'valueKey', 'labelKey', 'idKey', 'multiple'], // asyncOptions: Promise instance
  di: {
    inject: {
      formModel: Optional(FORM_MODEL)
    }
  },
  data() {
    return {
      options: [],
      loading: false
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
      return true
    }
  },
  watch: {
    asyncOptions(val) {
      this.getData()
    }
  },
  created() {
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
