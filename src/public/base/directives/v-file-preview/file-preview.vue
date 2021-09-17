<template>
  <div class="file-preview-container" @click="dialog.close()">
    <img v-if="dialog.config.type === FileType.image" :src="dialog.config.src"/>
    <video v-else-if="dialog.config.type === FileType.video" controls :src="dialog.config.src">
      <p>Your browser doesn't support HTML5 video. Here is a <a :href="dialog.config.src" target="_blank">link to the video</a> instead.</p>
    </video>
    <iframe v-else :src="dialog.config.src" frameborder="0" class="iframe"></iframe>
  </div>
</template>

<script>
import {Dialog} from "../../../dialogs/dialog";
import {FileType} from "./FileType";

export default {
  di: {
    inject: {
      dialog: Dialog
    }
  },
  data() {
    return {
      FileType
    }
  }
}
</script>

<style lang="less" scoped>
.file-preview-container {
  display: block;
  overflow: auto;
  padding: 20px;
  cursor: zoom-out;
}

video, img {
  max-width: 100%;
}
iframe {
  min-width: calc(100vw - 100px);
  min-height: calc(100vh - 100px);
}
</style>
