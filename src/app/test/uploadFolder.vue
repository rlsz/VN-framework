<template>
  <div class="flex vertical">
    <span>upload folder test:</span>
    <div class="file-selector">
      <input ref="input"
             type="file"
             v-on:change="onSelect($event.target)"
             webkitdirectory
      />
      <span v-on:click="onClick()"><slot></slot></span>
    </div>
    <span>upload folder test:</span>
    <app-file-selector
        v-model="folderFiles"
        @input="onInput($event)"
        style="align-self: flex-start;"
        webkitdirectory
    >
      <div class="flex vertical image-box">
        <span v-if="!folderFiles">选择文件夹</span>
        <template v-else>
          <span v-for="(item,index) in folderFiles" :key="'file-'+index">{{item.webkitRelativePath}}</span>
        </template>
      </div>
    </app-file-selector>
    <span>upload file test:</span>
    <app-file-selector style="align-self: flex-start;">
      <div class="flex vertical image-box">
        <span>选择文件</span>
      </div>
    </app-file-selector>
  </div>
</template>

<script>
import {AjaxService} from "@/public/base";
import {LoggerService} from "@/public/logger";

export default {
  name: "uploadFolder",
  di: {
    inject: {
      ajax: AjaxService,
      ls: LoggerService
    }
  },
  data() {
    return {
      folderFiles: null
    }
  },
  methods: {
    onClick() {
      this.$refs.input.click()
    },
    onSelect(input) {
      if(!input.files.length) {
        return
      }
      let form = new FormData()
      for (let i = 0; i < input.files.length; i++) {
        form.append("files", input.files[i]);
      }
      form.append("dirId", 80);
      form.append("dirName", 'test2');
      console.log(form)
      this.ajax.post('http://10.22.8.16:8000/document/uploadDir', form, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI2ZWQ2ZTNmZmYwNTk0N2M5ODg4ZDQwZTcxZDkwZDk4OCIsInVzZXIiOiJ4ZiIsInN1YiI6InhmIn0.TVpbGq-t9H8eoCQvjFLcQQnBVqzLfuZajx5hyRCuu7a_M24Z2-XsLmN58ieihFqRLO1nHmMfQM9MC_qePiPisQ'
        },
        onUploadProgress(progressEvent) {
          console.log('onUploadProgress', progressEvent)
        }
      }).then(res => {
        this.ls.success('上传成功')
      })
    },
    onInput(files) {
      console.log(files, this.folderFiles === files)
    }
  }
}
</script>

<style lang="less" scoped>
.image-box {
  min-width: 200px;
  padding: 20px;
  border: 1px dashed gray;
}
</style>
