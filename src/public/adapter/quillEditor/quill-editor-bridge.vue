<template>
  <quill-editor
      ref="myQuillEditor"
      v-bind="{...$props, ...$attrs}"
      v-on="{...$listeners}"
      @change="onEditorChange($event)"
      @dblclick.native="onDbClick"
  />
</template>

<script>
/** 原有的图片上传是将图片转为base64编码的字符串，导致上传文本过大
 * 原有的视频上传是弹窗输入视频地址，无法选择本地视频
 * 根据 https://www.cnblogs.com/zhengweijie/p/7305903.html 博客提供的参考方式添加自定义图片/视频交互方式
 */
import {DialogService} from "../../dialogs/dialog.service";
import ImgUploader from "../../base/components/img-uploader.vue";
import VideoUploader from "../../base/components/video-uploader.vue";
import * as Quill from 'quill'
import {ConvertBase64ImageToBlob, ConvertImageToCanvas, ConvertCanvasToBlob} from "../../base/utils";

export default {
  name: "quill-editor-bridge",
  props: ['upload', 'options'],
  di: {
    inject: {
      ds: DialogService
    }
  },
  data() {
    return {
    }
  },
  computed: {
    quill() {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted() {
    if(this.upload) {
      const toolbar = this.quill.getModule('toolbar')
      toolbar.addHandler('image', this.imgHandler) // 为图片ICON绑定事件  getModule 为编辑器的内部属性
      toolbar.addHandler('video', this.videoHandler)  // 为视频ICON绑定事件
      const clipboard = this.quill.getModule('clipboard')
      clipboard.addMatcher(Node.ELEMENT_NODE, this.nodeHandler)
    }
  },
  methods: {
    onDbClick(e) {
      const target = e.target
      if(target instanceof HTMLImageElement) {
        target.crossOrigin='anonymous'
        ConvertImageToCanvas(target).then(temp => {
          return ConvertCanvasToBlob(temp, target.src.split(/\/|\\/).pop())
        }).then(img => {
          this.ds.open(ImgUploader, {
            image: img,
            'close-on-click-overlay': false,
            backgroundCover: false,
            'before-close': (done, image) => {
              if(image && this.upload) {
                this.upload(image).then(url => {
                  done(url)
                })
              } else {
                done()
              }
            }
          }).afterClosed().then(url => {
            if(url) {
              target.src = url
            }
          })
        })
      }
    },
    onEditorChange(event) {

    },
    imgHandler(state) {
      if(state) {
        this.uploadImage()
      }
    },
    videoHandler(state) {
      if(state) {
        const addRange = this.quill.getSelection()
        this.ds.open(VideoUploader, {
          'close-on-click-overlay': false,
          backgroundCover: false,
          'before-close': (done, video) => {
            if(video && this.upload) {
              this.upload(video).then(url => {
                done(url)
              })
            } else {
              done()
            }
          }
        }).afterClosed().then(url => {
          if (url) {
            const length = addRange !== null ? addRange.index : 0
            this.quill.insertEmbed(length, 'video', url, Quill.sources.USER)   // 调用编辑器的 insertEmbed 方法，插入URL
            this.quill.setSelection(length + 1)
          }
        })
      }
    },
    nodeHandler(node, Delta) {
      let ops = []
      Delta.ops.forEach(op => {
        const imgBase64 = op.insert?.image
        if (imgBase64) {
          this.$nextTick(() => {
            this.uploadImage(ConvertBase64ImageToBlob(imgBase64))
          })
        } else {
          ops.push(op)
        }
      })
      Delta.ops = ops
      return Delta
    },
    uploadImage(image) {
      const addRange = this.quill.getSelection()
      this.ds.open(ImgUploader, {
        image,
        'close-on-click-overlay': false,
        backgroundCover: false,
        'before-close': (done, image) => {
          if(image && this.upload) {
            this.upload(image).then(url => {
              done(url)
            })
          } else {
            done()
          }
        }
      }).afterClosed().then(url => {
        if (url) {
          const length = addRange !== null ? addRange.index : 0
          this.quill.insertEmbed(length, 'image', url, Quill.sources.USER)   // 调用编辑器的 insertEmbed 方法，插入URL
          this.quill.setSelection(length + 1)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
