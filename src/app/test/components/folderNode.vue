<template>
  <div class="folder-node">
    <div v-for="(item, key, index) in value">
      <fileNode v-if="isFile(item)" :value="item" :level="level+1"></fileNode>
      <div v-else>
        <span class="shrink">
          <span>{{ key }}:</span>
          <span class="link" @click="playChildren(index)">自动播放所有</span>
        </span>
        <folderNode :value="item" :level="level+1" ref="ref-item"></folderNode>
      </div>
    </div>
  </div>
</template>

<script>
import fileNode from './fileNode.vue'
import {throttle} from "@/public/base";
import {DialogService} from "@/public/dialogs";
import {LoggerService} from "@/public/logger";
import {MovieService} from "./MovieService";

export default {
  name: "folderNode",
  components: {
    fileNode,
    folderNode: () => import('./folderNode')
  },
  props: {
    level: {
      type: Number,
      default: 0
    },
    value: {
      type: Object,
      default: {}
    }
  },
  di: {
    inject: {
      ds: DialogService,
      ls: LoggerService,
      ms: MovieService
    }
  },
  methods: {
    isFile(target) {
      return target instanceof Blob
    },
    playChildren(i) {
      this.ms.multiPlay(this.$refs['ref-item'][i].$el.querySelectorAll('.file-node'))
    }
  }
}
</script>

<style lang="less" scoped>
.folder-node {
  padding-left: 20px;
}
.link {
  margin-left: 8px;
}
</style>
