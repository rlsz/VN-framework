<template>
  <el-select
      ref="select"
      v-if="!refreshFlag"
      v-bind="{...$props, ...$attrs}"
      v-on="{...$listeners}"
      v-el-select-modify
      filterable
      remote
      reserve-keyword
      :remote-method="customRemoteMethod"
      :loading="loading"
      :multiple="multiple === undefined ? true : multiple"
  >
    <slot v-for="(item,index) in allOptions" v-bind:value="item" v-bind:index="index">
      use slotProps.value to access row data in slot template,
      https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots
    </slot>
  </el-select>
</template>

<script>
import {Distinct} from "@/public/base";

/**
 * 注意：需要为el-option选项指定key，否则可能造成options变化时el-tag显示混乱
 */
export default {
  name: "MultiSelectBridge",
  /**
   * remoteMethod: (keyword) => Promise<any[]>
   */
  props: ['value', 'remoteMethod', 'valueKey', 'multiple'],
  data() {
    return {
      loading: false,
      options: null,
      query: '',
      refreshFlag: false
    }
  },
  computed: {
    valueOptions() {
      if (this.multiple === false) {
        return this.value ? [this.value] : []
      } else {
        return this.value
      }
    },
    allOptions() {
      // 如果在query为空时隐藏选项，将会导致el-select的多选选项全都无法显示
      // if (!this.query) {
      //   return []
      // }
      if (this.valueKey) {
        return Distinct(
            [].concat(this.options || [], this.valueOptions || []),
            (a, b) => a[this.valueKey] === b[this.valueKey]
        )
      } else {
        return this.options
      }
    }
  },
  watch: {
    value(newVal, oldVal) {
      if(newVal !== oldVal) {
        this.refresh()
      }
    }
  },
  created() {
    this.options = this.valueOptions
  },
  mounted() {
    this.$watch(
        "$refs.select.query",
        (val) => {
          this.query = val
        }
    );
  },
  methods: {
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

<style scoped>

</style>
