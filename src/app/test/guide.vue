<template>
  <div class="flex vertical">
    <button>guide start</button>
    <div class="flex vertical" style="align-items: flex-start">
      <el-form :model="form" @submit.native.prevent>
        <el-form-item label="名称" v-guide>
          <el-input
              v-model="form.name"
              placeholder="名称"
              clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择">
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
export default {
  name: "guide",
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
  }
}
</script>

<style scoped>

</style>
