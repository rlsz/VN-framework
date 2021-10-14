<template>
  <el-select
      :loading="loading"
      v-bind="{...$props, ...$attrs, asyncOptions: undefined}"
      v-on="{...$listeners}"
      v-if="$listeners.input"
  >
    <slot v-for="(item,index) in options" v-bind:value="item" v-bind:index="index"></slot>
  </el-select>
  <span v-else-if="multipleProp" class="multiple-selections">
    <slot name="value"
          v-for="(item,index) in value"
          v-bind:value="item"
          v-bind:index="index"
          v-bind:optionsMap="optionsMap"
    ></slot>
  </span>
  <span v-else-if="optionsMap[value]">
    <slot name="value" v-bind:value="optionsMap[value]"></slot>
  </span>
  <span v-else>{{value}}</span>
</template>

<script>
export default {
  name: "async-select",
  props: ['asyncOptions', 'value', 'valueKey', 'multiple'], // asyncOptions: Promise instance
  data() {
    return {
      options: [],
      loading: false
    }
  },
  computed: {
    optionsMap() {
      return this.options.reduce((obj, item) => {
        obj[item[this.valueKey || 'value']] = item
        return obj
      }, {})
    },
    multipleProp() {
      return this.multiple === '' ? true : this.multiple;
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
