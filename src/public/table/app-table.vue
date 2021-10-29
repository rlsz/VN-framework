<template>
  <div class="table">
    <div class="row header">
      <span>checkbox</span>
      <span>标题</span>
      <span>来源</span>
      <span>频道</span>
      <span>状态</span>
      <span>操作</span>
    </div>
    <template v-for="(row, index) in list">
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
</template>

<script>
/**
 * data: any[] | Promise<any[]>
 * query: (page:number,size:number) => Promise<{ data: any[], total: number }>
 */
export default {
  name: "app-table",
  props: ['data', 'query'],
  data() {
    return {
      list: []
    }
  },
  created() {
    Promise.resolve(this.data).then(d => {
      this.list = d || []
    })
  }
}
</script>

<style scoped>

</style>
