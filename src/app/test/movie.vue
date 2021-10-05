<template>
  <div class="flex vertical">
    <app-file-selector v-model="files" webkitdirectory>
      <div class="flex vertical cross-center image-box">
        <i class="el-icon-upload"></i>
        <template v-if="!files">
          <span style="color: #409EFF;">点击选择文件夹</span>
        </template>
        <template v-else>
          <span>{{ folderName }}</span>
          <span style="color: #d9d9d9;">(共{{ files.length }}个文件)</span>
          <span style="color: #409EFF;">点击更换文件夹</span>
        </template>
      </div>
    </app-file-selector>
    <div>
      <span>解析文件列表:</span>
      <folderNode :value="folderTree"></folderNode>
    </div>
  </div>
</template>

<script>
import folderNode from "./components/folderNode.vue";
export default {
  name: "movie",
  components: {folderNode},
  data(){
    return {
      files: []
    }
  },
  computed: {
    folderName() {
      console.log(this.files)
      if (this.files?.length) {
        const temp = this.files[0].webkitRelativePath.match(/[\/\\]/)?.index
        if (temp > 0) {
          return this.files[0].webkitRelativePath.substring(0, temp)
        }
      }
      return ''
    },
    folderTree() {
      const root = {}
      if(!this.files?.length) {
        return root
      }
      this.files.forEach(file => {
        let node = root
        const paths = file.webkitRelativePath.split('/')
        paths.forEach(path => {
          if(/\.[a-zA-Z0-9]+$/.test(path)) {
            node[path] = file
          } else {
            if(!node[path]) {
              node[path] = {}
            }
            node = node[path]
          }
        })
      })
      return root
    }
  }
}
</script>

<style lang="less" scoped>
.image-box {
  min-width: 200px;
  padding: 16px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  line-height: 20px;
  i.el-icon-upload {
    font-size: 67px;
    color: #C0C4CC;
    margin-bottom: 16px;
    line-height: 50px;
  }
}
</style>
