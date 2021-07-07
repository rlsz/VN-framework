<template>
  <app-dialog-bridge class="video-uploader">
    <span slot="title">上传视频</span>
    <app-file-selector v-model="file"
                       accept="video/*"
                       capture="user"
    >
      <div class="flex vertical center video-box">
        <video controls v-if="fileUrl">
          <source :src="fileUrl" :type="file.type">
          Sorry, your browser doesn't support embedded videos.
        </video>
        <span v-else>选择视频</span>
      </div>
    </app-file-selector>
    <span class="flex" slot="footer" style="align-self: flex-end;">
      <button class="app-form" @click="onSubmit">上传</button>
    </span>
  </app-dialog-bridge>
</template>

<script>
import {Dialog} from "../../dialogs/dialog";

export default {
  di: {
    inject: {
      dialog: Dialog
    }
  },
  data() {
    return {
      file: null
    }
  },
  computed: {
    fileUrl() {
      return this.file ? URL.createObjectURL(this.file) : null
    }
  },
  methods: {
    onSubmit() {
      this.dialog.close(this.file)
    }
  },
}
</script>

<style lang="less" scoped>
.bridge-default-dialog {
  min-width: 300px !important;
}
button {
  display: inline-block;
  margin: 0px 5px;
}
.video-box {
  min-width: 100px;
  min-height: 100px;
  border: 1px solid #e3e3e3;
  position: relative;
  video {
    width: 100%;
    height: 100%;
  }
}
</style>
