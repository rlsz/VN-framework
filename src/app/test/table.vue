<template>
  <table-bridge :query="query" class="fill-available" :tree-props="{children: 'myChildren'}" @selection-change="onSelectionChange">
<!--  <table-bridge :query="query" size="20" :tree-props="{children: 'myChildren'}" @selection-change="onSelectionChange">-->
    <template v-slot:operate>
      <el-button type="warning" size="mini" @click="onTest">查看选项</el-button>
    </template>
    <el-table-column type="selection" width="55" fixed="left" align="center"/>
    <el-table-column align="left" min-width="250" label="标题">
      <template slot-scope="{row}">
        <span v-html="$options.filters.highlight(row.title, keywords)"></span>
      </template>
    </el-table-column>
    <el-table-column align="center" width="100" label="来源">
      <template slot-scope="{row}">
        <div>{{ row.sourceInfo && row.sourceInfo.name || '-' }}</div>
      </template>
    </el-table-column>
    <el-table-column align="center" width="100" label="频道">
      <template slot-scope="{row}">
        <div>{{ row.channel || '-' }}</div>
      </template>
    </el-table-column>
    <el-table-column property="state" align="center" label="状态" width="80"></el-table-column>
    <el-table-column label="操作" align="center" width="250">
      <template slot-scope="{row}">
        <el-button type="warning" size="mini">测试按钮1</el-button>
        <el-button type="warning" size="mini">测试按钮2</el-button>
      </template>
    </el-table-column>
  </table-bridge>
</template>

<script>
import {table_test_data} from "./test11111";
import {GetRandomNumber} from "@/public/base";

export default {
  name: "testTable",
  data(){
    return {
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
