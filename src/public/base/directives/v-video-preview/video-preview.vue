<template>
  <div class="video-preview-container flex center" @click="dialog.close()">
    <video controls :autoplay="!!dialog.config.autoplay" :src="dialog.config.src" ref="video" @ended="ended">
      <p>Your browser doesn't support HTML5 video. Here is a <a :href="dialog.config.src" target="_blank">link to the video</a> instead.</p>
    </video>
  </div>
</template>

<script>
import {Dialog} from "../../../dialogs/dialog";
import {FullscreenService} from "../../services/fullscreen.service";

export default {
  di: {
    inject: {
      dialog: Dialog,
      fs: FullscreenService
    }
  },
  mounted() {
    if(this.dialog.config?.fullscreen) {
      this.fs.toggle(this.$refs.video)
    }
  },
  methods: {
    ended() {
      this.dialog.close('ended')
    }
  }
}
</script>

<style lang="less" scoped>
.video-preview-container {
  //display: block;
  overflow: auto;
  padding: 20px;
  cursor: zoom-out;
}

video {
  max-width: 100%;
  max-height: 100%;
}

</style>
