<template>
  <div class="file-node flex cross-center" :class="{selected: checked}">
    <hbSwitch v-if="isVideo" v-model="checked"></hbSwitch>
    <span>{{value.name}}</span>
    <span v-if="isVideo" class="link" @click="play">play</span>
  </div>
</template>

<script>
import {GetFileExtension, IsInFullScreen, timer, ToggleFullScreen, VideoPreview} from "@/public/base";
import {DialogService, Model} from "@/public/dialogs";
import hbSwitch from './hb-switch.vue'
import {LoggerService} from "@/public/logger";
import {MovieService} from "./MovieService";

export default {
  name: "fileNode",
  components: {hbSwitch},
  props: {
    level: {
      type: Number,
      default: 0
    },
    value: null
  },
  di: {
    inject: {
      ds: DialogService,
      ls: LoggerService,
      ms: MovieService
    }
  },
  data() {
    return {
      checked: false
    }
  },
  computed: {
    extension() {
      return GetFileExtension(this.value.name)
    },
    isVideo() {
      return ['mp4', 'flv', 'f4v', 'webm', 'm4v', 'mov', '3gp', '3g2', 'rm', 'rmvb', 'wmv', 'avi', 'asf', 'mpg', 'mpeg', 'mpe', 'ts', 'div', 'dv', 'divx', 'vob', 'dat', 'mkv', 'lavf', 'cpk', 'dirac', 'ram', 'qt', 'fli', 'flc', 'mod'].indexOf(this.extension) >= 0
    }
  },
  methods: {
    play() {
      return this.ms.play(this.value)
      // return this.ds.open(VideoPreview, {
      //   src: URL.createObjectURL(this.value),
      //   model: Model.float,
      //   disableClose: false,
      //   autoplay: true,
      //   fullscreen: true,
      //   beforeClose: (done) => {
      //     if(IsInFullScreen()) {
      //       ToggleFullScreen().then(() => {
      //         done()
      //       })
      //     } else {
      //       done()
      //     }
      //   }
      // }).afterClosed()
    }
  }
}
</script>

<style lang="less" scoped>
.file-node {
  margin: 4px 0;
}
.link {
  margin-left: 8px;
}
.hb-switch {
  margin-right: 8px;
}
</style>
