<template>
  <div class="flex vertical" style="padding:20px;">
    <div class="flex vertical" style="align-items: flex-start">
      <el-form :model="form" @submit.native.prevent>
        <el-form-item label="名称1">
          <el-input
              v-guide="{ step: 'step-3', next: 'step-4', description: 'step 3 description' }"
              v-model="form.name"
              placeholder="名称1"
              clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="状态1">
          <el-select v-model="form.status"
                     placeholder="请选择"
                     v-guide="{ step: 'step-4', description: 'step 4 description' }"
          >
            <el-option v-for="item in statusMap"
                       :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {GuideService} from "@/components/guide";

export default {
  name: "guide",
  di: {
    inject: {
      guide: GuideService
    }
  },
  data() {
    return {
      form: {
        name: '',
        status: ''
      },
      statusMap: {
        0: {
          name: '服务正常',
          value: 0
        },
        1: {
          name: '服务异常',
          value: 1
        },
        2: {
          name: '服务错误',
          value: 2
        },
      }
    }
  },
  methods: {
    startGuide() {
      this.guide.next('step-1')
    }
  }
}
</script>

<style scoped>

</style>
