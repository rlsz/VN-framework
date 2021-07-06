<template>
  <quill-editor
      ref="myQuillEditor"
      v-bind="{...$props, ...$attrs}"
      v-on="{...$listeners}"
  />
</template>

<script>
/** 原有的图片上传是将图片转为base64编码的字符串，导致上传文本过大
 * 原有的视频上传是弹窗输入视频地址，无法选择本地视频
 * 根据 https://www.cnblogs.com/zhengweijie/p/7305903.html 博客提供的参考方式添加自定义图片/视频交互方式
 */
import {DialogService} from "../../dialogs/dialog.service";
import ImgUploader from "../../base/components/img-uploader.vue";

export default {
  name: "quill-editor-bridge",
  props: ['upload'],
  di: {
    inject: {
      ds: DialogService
    }
  },
  mounted() {
    if(this.upload) {
      this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler) // 为图片ICON绑定事件  getModule 为编辑器的内部属性
      this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('video', this.videoHandler)  // 为视频ICON绑定事件
    }
  },
  methods: {
    imgHandler(state) {
      if(state) {
        this.ds.open(ImgUploader, {
          'close-on-click-overlay': false,
          backgroundCover: false,
          'before-close': (done, image) => {
            if(image && this.upload) {
              this.upload(image).then(() => {
                done()
              })
            } else {
              done()
            }
          }
        })
      }
    },
    videoHandler(state) {
      console.log('videoHandler', state)
    }
  }
}
</script>

<style scoped>

</style>
