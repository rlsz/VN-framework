<template>
  <div class="flex vertical fill-content">
    <app-table :data="testData.data.data" size="0" :tree-props="{children: 'myChildren'}">
      <app-table-column type="selection" width="55" fixed="left" align="center"/>
<!--      <app-table-column align="left" min-width="250" label="标题" limit-line>-->
<!--        <template slot-scope="{row}">-->
<!--          <span v-html="$options.filters.highlight(row.title, ['资讯'])"></span>-->
<!--        </template>-->
<!--      </app-table-column>-->
      <app-table-column width="80" label="序号">
        <template slot-scope="{row, column, $index, context}">
          <div>{{ context.page * context.pageSize + $index + 1 }}</div>
        </template>
      </app-table-column>
      <app-table-column type="expend" property="title" align="left" label="标题" :highlight="['资讯', '电力']"></app-table-column>
      <app-table-column align="left" label="标题" :highlight="['资讯', '电力']">
        <template slot-scope="{row}">
          <span>{{row.title}}</span>
        </template>
      </app-table-column>
      <app-table-column align="center" width="100" label="来源">
        <template slot-scope="{row}">
          <div>{{ row.sourceInfo && row.sourceInfo.name || '-' }}</div>
        </template>
      </app-table-column>
      <app-table-column align="center" width="100" label="频道">
        <template slot-scope="{row}">
          <div>{{ row.channel || '-' }}</div>
        </template>
      </app-table-column>
      <app-table-column property="state" align="center" label="状态" width="80"></app-table-column>
      <app-table-column label="操作" align="center" width="320">
        <template slot-scope="{row}">
          <el-button type="warning" size="mini">测试按钮1</el-button>
          <el-button type="warning" size="mini">测试按钮2</el-button>
        </template>
      </app-table-column>
    </app-table>
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
