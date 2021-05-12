<template>
  <app-dialog-bridge>
    <span slot="title">新增搜索策略</span>
    <app-bridge-el-form ref="form" :form="form">
      <app-bridge-el-form-item label="名称" prop="name">
        <template v-slot:default="{control}">
          <el-input v-model="control.value" style="width:320px;" />
        </template>
      </app-bridge-el-form-item>

      <app-bridge-el-form-item label="索引映射" prop="indexFieldMappingId">
        <template v-slot:default="{control}">
          <el-select
            v-model="control.value"
            placeholder="请选择索引映射"
            style="width:320px;"
          >
            <el-option
              v-for="item in indexFieldMappingArray"
              :key="'index-field-mapping-' + item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </template>
      </app-bridge-el-form-item>
      <app-bridge-el-form-item label="配置项" prop="strategy" class="strategy">
        <template v-slot:default="scope">
          <div class="table">
            <div class="row header">
              <span>字段名称</span>
              <span>字段路径</span>
              <span style="flex-grow: 0.5;">权重</span>
              <span>记分方式</span>
              <span style="flex-grow: 0.5;">是否返回</span>
              <span style="flex-grow: 2;flex-basis:66px;">过滤条件</span>
            </div>
            <template v-for="(item, index) in scope.control.controls">
              <app-bridge-el-form ref="strategy" class="row" :form="item" :key="'strategy-form-item-'+index">
                <app-bridge-el-form-item prop="fileName">
                  <template v-slot:default="{control}">
                    <el-select v-model="control.value" placeholder="请选择">
                      <el-option
                        v-for="(value, key) in fileNameMap"
                        :key="'strategy-' + index + '-fileName-' + key"
                        :label="key"
                        :value="key"
                      />
                    </el-select>
                  </template>
                </app-bridge-el-form-item>
                <span>{{item.value.path}}</span>
                <span style="flex-grow: 0.5;">
                  <el-input v-model.number="item.value.weight" />
                </span>
                <span>
                  <el-select v-model="item.value.sortType" placeholder="请选择">
                    <el-option value="TFIDF" />
                    <el-option value="constant" />
                  </el-select>
                </span>
                <span style="flex-grow: 0.5;">
                  <el-select v-model="item.value.isReturn" placeholder="请选择">
                    <el-option label="是" :value="true" />
                    <el-option label="否" :value="false" />
                  </el-select>
                </span>
                <span>
                  <el-select v-model="item.value.filterType" placeholder="请选择">
                    <el-option value="must" />
                    <el-option value="must_not" />
                    <el-option value="range" />
                  </el-select>
                </span>
                <app-bridge-el-form-item prop="filterCondition">
                  <template v-slot:default="{control}">
                    <el-input v-model="control.value" />
                  </template>
                </app-bridge-el-form-item>
                <i class="minus-circle" @click="delStrategy(item)"></i>
              </app-bridge-el-form>
            </template>
          </div>
        </template>
        <div class="flex center" style="padding: 5px;">
          <i class="plus-circle" @click="addStrategy()"></i>
        </div>
      </app-bridge-el-form-item>
      <app-bridge-el-form-item label="排序脚本" prop="sortScript">
        <template v-slot:default="{control}">
          <el-input v-model="control.value" style="width:320px;" />
        </template>
      </app-bridge-el-form-item>
      <app-bridge-el-form-item label="排序脚本参数" prop="sortScriptParam">
        <template v-slot:default="{control}">
          <el-input v-model="control.value" style="width:320px;" />
        </template>
      </app-bridge-el-form-item>
      <app-bridge-el-form-item label="状态" prop="status">
        <template v-slot:default="{control}">
          <el-radio-group v-model="control.value">
            <el-radio
              v-for="item in dict.common_status"
              :key="item.id"
              :label="item.value === 'true'"
            >{{ item.label }}
            </el-radio>
          </el-radio-group>
        </template>
      </app-bridge-el-form-item>
    </app-bridge-el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="submit">确认</el-button>
    </div>
  </app-dialog-bridge>
</template>

<script>
import {Dialog} from "@/public/dialogs";
import {FormBuilder, FormArray} from "@/public/form";

export default {
  name: "modify",
  di: {
    inject: {
      dialog: Dialog
    }
  },
  data() {
    const form = new FormBuilder().group({
      id: [null],
      name: ['', [{ required: true, message: '名称不能为空', trigger: 'blur' }]],
      indexFieldMappingId: [null, [{ required: true, message: '索引映射不能为空', trigger: 'change' }]],
      strategy: [new FormArray(
        [],
        {
          fileName: [null, [{ required: true, message: '字段名称不能为空', trigger: 'change' }]],
          path: [''],
          weight: [null, [{ required: true, message: '权重不能为空', trigger: 'blur' }]],
          sortType: [null, [{ required: true, message: '计分方式不能为空', trigger: 'change' }]],
          filterType: [null, [{ required: true, message: '过滤条件不能为空', trigger: 'change' }]],
          filterCondition: [null, [{ required: true, message: '过滤条件不能为空', trigger: 'blur' }]],
          isReturn: [false]
        }
      ), [{ required: true, message: '配置项不能为空', trigger: 'change' }]],
      status: [null, [{ required: true, message: '请选择状态', trigger: 'change' }]],
      sortScript: [''],
      sortScriptParam: [''],
      fileName: ['test']
    })
    console.log(form)
    return {
      loading: false,
      form,
      indexFieldMappingArray: [],
      dict: {
        common_status: [{"createBy":"admin","updateBy":"admin","createTime":1598839966000,"updateTime":1598866675000,"id":17,"dict":{"id":7},"label":"启用","value":"true","dictSort":1},{"createBy":"admin","updateBy":"admin","createTime":1598839978000,"updateTime":1598866681000,"id":18,"dict":{"id":7},"label":"停用","value":"false","dictSort":2}]
      }
    }
  },
  computed: {
    indexFieldMapping() {
      const value = this.form.value
      if(!value.indexFieldMappingId) {
        return null
      }
      return this.indexFieldMappingArray.find(c => c.id === value.indexFieldMappingId)
    },
    fileNameMap() {
      if(!this.indexFieldMapping) {
        return {}
      }
      return this.indexFieldMapping.indexMappings.properties
    }
  },
  watch: {
    indexFieldMapping(val, oldVal) {
      if (!(val === oldVal)) {
        this.form.get('strategy').clear()
        this.addStrategy()
      }
    }
  },
  created() {
    Promise.resolve({"code":200,"message":"OK","data":{"data":[{"id":97,"name":"dasheng_stock_ac_v7_自动补全-股票","indexMappings":{"properties":{"prefixSuggests":{"max_input_length":50,"analyzer":"keyword_lowercase","preserve_position_increments":true,"type":"completion","preserve_separators":true},"exactMatchSuggests":{"max_input_length":50,"analyzer":"keyword_lowercase","preserve_position_increments":true,"type":"completion","preserve_separators":true},"suffixSuggests":{"max_input_length":50,"analyzer":"keyword_lowercase","preserve_position_increments":true,"type":"completion","preserve_separators":true},"name":{"type":"keyword"},"id":{"type":"keyword"},"type":{"type":"keyword"},"middleSuggests":{"max_input_length":50,"analyzer":"keyword_lowercase","preserve_position_increments":true,"type":"completion","preserve_separators":true}}}},{"id":98,"name":"dasheng_stock_ac_v7_自动补全-独角兽","indexMappings":{"properties":{"prefixSuggests":{"max_input_length":50,"analyzer":"keyword_lowercase","preserve_position_increments":true,"type":"completion","preserve_separators":true},"exactMatchSuggests":{"max_input_length":50,"analyzer":"keyword_lowercase","preserve_position_increments":true,"type":"completion","preserve_separators":true},"suffixSuggests":{"max_input_length":50,"analyzer":"keyword_lowercase","preserve_position_increments":true,"type":"completion","preserve_separators":true},"name":{"type":"keyword"},"id":{"type":"keyword"},"type":{"type":"keyword"},"middleSuggests":{"max_input_length":50,"analyzer":"keyword_lowercase","preserve_position_increments":true,"type":"completion","preserve_separators":true}}}},{"id":102,"name":"dasheng_stock_htac_v7_自动补全-股票","indexMappings":{"properties":{"suggestItems":{"type":"nested","properties":{"input":{"analyzer":"whitespace","type":"text"},"weight":{"type":"long"}}},"name":{"type":"keyword"},"id":{"type":"keyword"},"type":{"type":"keyword"}}}},{"id":103,"name":"dasheng_concept_ac_v1_自动补全-行业概念","indexMappings":{"properties":{"prefixSuggests":{"max_input_length":50,"analyzer":"keyword_lowercase","preserve_position_increments":true,"type":"completion","preserve_separators":true},"exactMatchSuggests":{"max_input_length":50,"analyzer":"keyword_lowercase","preserve_position_increments":true,"type":"completion","preserve_separators":true},"suffixSuggests":{"max_input_length":50,"analyzer":"keyword_lowercase","preserve_position_increments":true,"type":"completion","preserve_separators":true},"name":{"type":"keyword"},"id":{"type":"keyword"},"type":{"type":"keyword"},"middleSuggests":{"max_input_length":50,"analyzer":"keyword_lowercase","preserve_position_increments":true,"type":"completion","preserve_separators":true}}}},{"id":106,"name":"broker_news_v2_资讯数据测试","indexMappings":{"properties":{"titleSeg":{"analyzer":"whitespace","type":"text"},"ossUrl":{"type":"keyword"},"contents":{"type":"nested","properties":{"contentSeg":{"analyzer":"whitespace","type":"text"},"content":{"index":false,"type":"keyword"}}},"publishDate":{"format":"yyyy-MM-dd HH:mm:ss","type":"date"},"id":{"type":"keyword"},"sourceName":{"type":"keyword"},"title":{"index":false,"type":"keyword"}}}},{"id":111,"name":"news_tag_v2_标签资讯","indexMappings":{"properties":{"titleSeg":{"analyzer":"whitespace","type":"text"},"contents":{"type":"nested","properties":{"contentSeg":{"analyzer":"whitespace","type":"text"},"content":{"index":false,"type":"keyword"}}},"tagIds":{"type":"nested","properties":{"fund":{"type":"keyword"},"concept":{"type":"keyword"},"stock":{"type":"keyword"},"region":{"type":"keyword"}}},"id":{"type":"keyword"},"title":{"index":false,"type":"keyword"}}}}]}}).then(res => {
      this.indexFieldMappingArray = res.data.data
    })
  },
  methods: {
    cancel() {
      this.dialog.close()
    },
    submit() {
      Promise.all([
        // ...this.$refs.strategy.map(item => item.validate()),
        this.$refs.form.validate()
      ]).then(res => {
        console.log(res)
        // todo
        console.log(this.form)
      }).catch(() => {
        // err will be false
      })
    },
    addStrategy() {
      this.form.get('strategy').push()
    },
    delStrategy(index) {
      this.form.get('strategy').removeAt(index)
    }
  }
}
</script>

<style lang="less" scoped>
.strategy {
  padding-right: 40px;
  .table {
    .row:not(.header) {
      position: relative;
      padding-right: 40px;
      margin-right: -40px;
      > :nth-last-child(2) {
        border-right-color: rgba(0,0,0,0);
      }
      i.minus-circle {
        position: absolute;
        align-self: center;
        right: 10px;
        padding: 0;
        display: none;
        background-color: white;
        border-bottom-color: rgba(0,0,0,0);
      }
      &:hover i.minus-circle {
        display: initial;
      }
      .el-form-item {
        margin: 0;
      }
    }
  }
}
</style>
