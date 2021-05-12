<template>
  <div>
    <span>{{as.test || '***********'}}</span>
    <el-table
        border
        fit
        :data="ss.list"
        size="small"
        highlight-current-row
        style="width: 100%;"
        row-key="id"
        :default-expand-all="false"
        :tree-props="{children:'subCategories', hasChildren: 'hasChildren'}"
        @selection-change="onCheckboxChange"
    >
      <el-table-column type="selection" width="55" fixed="left"/>
      <el-table-column prop="name" label="标签分类">
        <template slot-scope="{ row }">
          {{ row.name || '未填写' }}
        </template>
      </el-table-column>
      <el-table-column prop="category" label="标签名称">
        <template slot-scope="{ row }">
          {{ row.category || '未填写' }}
        </template>
      </el-table-column>
      <el-table-column prop="source" label="来源"/>

      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>

      <el-table-column prop="datasourceDbId" label="元数据">
        <template slot-scope="scope">
          {{ scope.row.datasourceDbId }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="状态"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import {Test, SomeService} from './main.service'
import {AppService} from "@/app/app.service";
import {AjaxService, LoadingService} from "@/public/base";
export default {
  name: 'Home',
  data() {
    return {
      checkedList: [],
      list: [{"id":86,"name":"申万行业","memo":"","isDisplay":"1","disOrder":3,"entrytime":"2019-05-21 14:31:47","updatetime":"2019-06-04 10:55:27","groundtime":"2019-06-24 16:06:34","updateid":null,"resourceid":"alg_model","recordid":null,"isvalid":1,"parentId":null,"tagCount":66,"subTagCategoryDtos":[]},{"id":89,"name":"概念","memo":"","isDisplay":"1","disOrder":3,"entrytime":"2019-05-21 14:31:47","updatetime":"2019-06-04 10:55:23","groundtime":"2019-06-24 16:06:34","updateid":null,"resourceid":"alg_model","recordid":null,"isvalid":1,"parentId":null,"tagCount":261,"subTagCategoryDtos":[]},{"id":240,"name":"过滤一下","memo":"","isDisplay":"1","disOrder":3,"entrytime":"2021-04-06 15:17:25","updatetime":"2021-04-06 15:17:25","groundtime":"2021-04-06 15:17:25","updateid":null,"resourceid":"manual","recordid":null,"isvalid":1,"parentId":0,"tagCount":9,"subTagCategoryDtos":[]},{"id":241,"name":"test1","memo":"111","isDisplay":"1","disOrder":3,"entrytime":"2021-04-08 11:10:31","updatetime":"2021-04-08 11:10:31","groundtime":"2021-04-08 11:10:31","updateid":null,"resourceid":"manual","recordid":null,"isvalid":1,"parentId":0,"tagCount":3,"subTagCategoryDtos":[{"id":242,"name":"test2","memo":"222","isDisplay":"1","disOrder":3,"entrytime":"2021-04-08 11:10:37","updatetime":"2021-04-08 11:10:37","groundtime":"2021-04-08 11:10:37","updateid":null,"resourceid":"manual","recordid":null,"isvalid":1,"parentId":241,"tagCount":3,"subTagCategoryDtos":[]}]}]
    }
  },
  di: {
    providers: [Test],
    inject: {
      test: Test,
      ss: SomeService,
      as: AppService,
      ajax: AjaxService,
      loading: LoadingService
    }
  },
  created() {
    console.log(this.$injector, this.$injector.get(Test) === this.test)
    this.ss.getData().then(res=> {
      this.ss.list = res
    })
  },
  methods: {
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 31,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            id: 32,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }
        ])
      }, 1000)
    },
    onCheckboxChange(selection) {
      this.checkedList = selection;
    }
  }
}
</script>
