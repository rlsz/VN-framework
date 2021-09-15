<template>
  <div class="video-preview-container" @click="dialog.close()">
    <video controls :src="dialog.config.src">
      <p>Your browser doesn't support HTML5 video. Here is a <a :href="dialog.config.src" target="_blank">link to the video</a> instead.</p>
    </video>
  </div>
</template>

<script>
import {Dialog} from "../../../dialogs/dialog";

export default {
  di: {
    inject: {
      dialog: Dialog
    }
  }
}
</script>

<style lang="less" scoped>
.video-preview-container {
  display: block;
  overflow: auto;
  padding: 20px;
  cursor: zoom-out;
}

video {
  max-width: 100%;
}

</style>
