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
    <video controls autoplay :src="ms.src" ref="video" @ended="ms.end()"></video>
    <div>
      <span>解析文件列表:<span class="link" @click="playSelected">自动播放选中视频</span></span>
      <folderNode :value="folderTree"></folderNode>
    </div>
  </div>
</template>

<script>
import folderNode from "./components/folderNode.vue";
import hbSwitch from './components/hb-switch.vue'
import {GetFileExtension, throttle, ToggleFullScreen} from "@/public/base";
import {MovieService} from "./components/MovieService";
export default {
  name: "movie",
  components: {folderNode, hbSwitch},
  di: {
    providers: [MovieService],
    inject: {
      ms: MovieService
    }
  },
  data(){
    return {
      files: []
    }
  },
  computed: {
    folderName() {
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
      const temp = this.files.filter(c => ['.DS_Store'].indexOf(c.name) < 0).map( c => {
        if(/^([^第]+)第(\d+)[^\d]+/.test(c.webkitRelativePath)) {
          c.season = RegExp.$1
          c.episode = Number(RegExp.$2)
        }
        return c
      })
      console.log(temp)
      temp.sort((a, b) => {
        if(a.season && b.season) {
          if (a.season < b.season) return -1;
          if (a.season > b.season) return 1;

          if (a.episode < b.episode) return -1;
          if (a.episode > b.episode) return 1;
          return 0
        }
        if(a.season && !b.season) return -1;
        if(!a.season && b.season) return 1;
        if (a.webkitRelativePath < b.webkitRelativePath) return -1;
        if (a.webkitRelativePath > b.webkitRelativePath) return 1;
        return 0
      })
      temp.forEach(file => {
        let node = root
        const paths = file.webkitRelativePath.split('/')
        paths.forEach(path => {
          if(GetFileExtension(path)) {
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
  },
  methods: {
    playSelected() {
      this.ms.multiPlay(this.$el.querySelectorAll('.file-node.selected'))
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
