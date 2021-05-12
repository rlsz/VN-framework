<template>
  <div class="upload-image-test">
    <div class="flex">
      <span>图片尺寸：</span>
      <form class="flex vertical">
        <span>目标宽度:</span>
        <input type="number" v-model.number="form.width">
        <span>目标高度:</span>
        <input type="number" v-model.number="form.height">
      </form>
    </div>
    <div class="flex">
      <span>点击上传：</span>
      <app-file-selector v-model="file"
                         @on-select="selectOriginalFile($event)"
                         :zip="{ width: form.width, height: form.height }"
                         mime="image/jpeg"
                         accept="image/*"
      >
        <div class="flex vertical center image-box"
             :style="{width: form.width/5+'px',height:form.height/5+'px'}">
          <img v-if="filePath" :src="filePath"/>
          <span v-if="!filePath">选择图片</span>
        </div>
      </app-file-selector>
      <span v-if="filePath" style="margin: 0 20px;">
        <a :href="filePath" target="_blank" :download="file.name">下载</a>
      </span>
    </div>
    <div class="flex" v-if="originalFileInfo">
      <span>原始图片信息：</span>
      <div class="flex vertical">
        <template v-if="originalFileInfo">
          <span>dimension: {{ originalFileInfo.w }}*{{ originalFileInfo.h }} pixels</span>
          <span>file size: {{ (originalFileInfo.size / 1024).toFixed(2) }} kBytes</span>
          <span>file name: {{ originalFileInfo.name }}</span>
          <span>file type: {{ originalFileInfo.type }}</span>
        </template>
      </div>
    </div>
    <div class="flex" v-if="fileInfo">
      <span>处理后的图片信息：</span>
      <div class="flex vertical">
        <template v-if="fileInfo">
          <span>dimension: {{ fileInfo.w }}*{{ fileInfo.h }} pixels</span>
          <span>file size: {{ (fileInfo.size / 1024).toFixed(2) }} kBytes</span>
          <span>file name: {{ fileInfo.name }}</span>
          <span>file type: {{ fileInfo.type }}</span>
        </template>
      </div>
    </div>

  </div>
</template>

<script>
import {GetImageInfo} from "@/public/base";

export default {
  name: "uploadImage",
  data() {
    return {
      form: {
        width: 810,
        height: 345
      },
      file: null,
      fileInfo: null,
      originalFileInfo: null
    }
  },
  computed: {
    filePath() {
      if (this.file) {
        return URL.createObjectURL(this.file)
      } else {
        return null
      }
    }
  },
  watch: {
    file(val) {
      if (val) {
        GetImageInfo(val).then(info => {
          this.fileInfo = info
        })
      } else {
        this.fileInfo = null;
      }
    }
  },
  methods: {
    selectOriginalFile(file) {
      GetImageInfo(file).then(info => {
        this.originalFileInfo = info
      })
    }
  }
}
</script>

<style lang="less" scoped>
.image-box {
  width: 80px;
  height: 102px;
  border: 1px solid #e3e3e3;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    //position: absolute;
  }
}
.upload-image-test {
  padding: 20px;
  > * ~ * {
    margin-top: 16px;
  }
  > div {
    > :nth-child(2n){
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #323335;
      line-height: 20px;
    }
    > :nth-child(2n+1){
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #43454C;
      line-height: 28px;
    }
  }
}

</style>
