<template>
  <div class="flex vertical fill-content">
    <div class="table">
      <div class="row header">
        <span>checkbox</span>
        <span>标题</span>
        <span>来源</span>
        <span>频道</span>
        <span>状态</span>
        <span>操作</span>
      </div>
      <template v-for="(row, index) in testData">
        <div class="row">
          <span>checkbox</span>
          <span v-html-new="$options.filters.highlight(row.title, keywords)"></span>
          <div>{{ row.sourceInfo && row.sourceInfo.name || '-' }}</div>
          <div>{{ row.channel || '-' }}</div>
          <span>{{ row.state }}</span>
          <span>
            <el-button type="warning" size="mini">测试按钮1</el-button>
            <el-button type="warning" size="mini">测试按钮2</el-button>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {table_test_data} from "./test11111";
import {GetRandomNumber} from "@/public/base";

export default {
  name: "testTable",
  data(){
    return {
      testData: table_test_data,
      keywords: [],
      selected: []
    }
  },
  created() {
    this.setQuery()
  },
  methods: {
    setQuery() {
      this.query = (page, size) => {
        console.log('query', page, size)
        return new Promise(r => {
          setTimeout(() => {
            r({
              status: 200,
              data: table_test_data
            })
          }, 1000 * page)
        }).then(res => {
          if (res.status !== 200) {
            throw new Error(res.statusText)
          }
          if (res.data.code !== '200') {
            throw new Error(res.data.message)
          }
          return res.data.data
        }).then(res => {
          this.keywords = [...res.highlights, '资讯']
          return {
            data: res.data,
            total: GetRandomNumber(res.totalNum, res.totalNum + 100)
          }
        })
      }
    },
    onSelectionChange(rows) {
      this.selected = rows
    },
    onTest() {
      console.log('current selection', this.selected)
    }
  }
}
</script>

<style scoped>

</style>
