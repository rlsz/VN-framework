<template>
  <div class="flex vertical cross-center">
    <app-file-selector class="photo-selector"
                       v-model="file"
                       accept="image/*"
                       :zip="{ maxWidth: 2048, maxHeight: 2048 }"
                       capture="user"
                       :mime="croppedConfig.type"
    >
      <div class="flex vertical center image-box"
           :style="{width: '100px', height: '100px'}">
        <img v-if="fileUrl" :src="fileUrl"/>
        <span v-else>选择图片</span>
      </div>
    </app-file-selector>
    <vue-cropper
        ref="cropper"
        :cropBoxMovable="true"
        :cropBoxResizable="true"
        :toggleDragModeOnDblclick="false"
        :zoomOnWheel="false"
        :zoomOnTouch="false"
        :zoomable="false"
        :viewMode="1"
        :minCropBoxWidth="croppedConfig.width"
        :minCropBoxHeight="croppedConfig.height"
        dragMode="move"
        class="cropper"
        @ready="cropperReady"
    ></vue-cropper>
    <app-scale-bar v-model="currentScale" @input="changeScale"></app-scale-bar>
    <button @click="onSubmit">Submit</button>
    <div v-if="croppedFileUrl" class="cropped">
      <img :src="croppedFileUrl" :style="{width: croppedConfig.width+'px',height:croppedConfig.height+'px'}"/>
    </div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import {GetImageInfo, throttle} from "@/public/base";

/**
 * https://github.com/Agontuk/vue-cropperjs
 * https://github.com/fengyuanchen/cropperjs#methods
 */
export default {
  name: 'HelloWorld',
  components: {
    VueCropper
  },
  props: {
    msg: String
  },
  data() {
    return {
      file: null,
      currentScale: 0,
      croppedFile: null,
      croppedConfig: {
        width: 100,
        height: 100,
        type: 'image/jpeg'
      }
    }
  },
  computed: {
    fileUrl() {
      return this.file ? URL.createObjectURL(this.file) : null
    },
    croppedFileUrl() {
      return this.croppedFile ? URL.createObjectURL(this.croppedFile) : null
    }
  },
  watch: {
    file() {
      this.$nextTick(() => {
        if (this.file) {
          this.$refs.cropper.replace(this.fileUrl);
        }
      })
    }
  },
  methods: {
    changeScale() {
      this.$refs.cropper.scale(1 + this.currentScale * 10);
    },
    onSubmit() {
      if (!this.file) {
        this.croppedFile = null;
        return;
      }
      /** 插件getCroppedCanvas方法的maxWidth和maxHeight参数会导致crop box位置出现偏差，
       *  所以图片的预处理、预压缩需放到上传图片组件中处理，
       *  插件的最大宽高为4096，预处理时使用2048作为最大值一方面可以防止图片大小超出插件预设值，另一方面还可以提升处理速度
       */
      this.$refs.cropper
          .getCroppedCanvas({
            width: this.croppedConfig.width,
            height: this.croppedConfig.height,
            fillColor: '#fff'
          })
          .toBlob((blob) => {
            blob.name = this.file?.name;
            blob.lastModifiedDate = new Date();

            this.croppedFile = blob
            GetImageInfo(blob).then(res => {
              console.log(res)
            })
          }, this.croppedConfig.type);
    },
    cropperReady() {
      const cropper = this.$refs.cropper
      this.currentScale = 0
      this.changeScale()
      const {width, height} = cropper.getContainerData()
      cropper.setCropBoxData({
        left: (width - this.croppedConfig.width) / 2,
        top: (height - this.croppedConfig.height) / 2,
        width: this.croppedConfig.width,
        height: this.croppedConfig.height
      })
    }
  },
  created() {
    const a = {
      aa: throttle(function (i) {
        return new Promise(r => {
          setTimeout(() => {
            console.log('aa', i, this)
            r(i)
          }, 1000)
        })
      }, 1, i => i),
      bb: function (i) {
        return new Promise(r => {
          setTimeout(() => {
            console.log('bb', i, this)
            r(i)
          }, 1000)
        })
      }
    }
    a.aa(1)
    a.aa(2)
    a.aa(2)
    a.aa(3)

    a.bb(1)
    a.bb(2)
    a.bb(2)
    a.bb(3)
  }
}
</script>

<style lang="less" scoped>

.photo-selector.file-selector {
  display: inline-flex;

  //img {
  //  width: 100px;
  //  height: 100px;
  //}
}

.cropper {
  align-self: center;
  flex: 0 0 auto;
  width: 600px;
  height: 300px;
  background: rgba(245, 246, 247, 0.8);

  /deep/ .cropper-drag-box.cropper-modal {
    background: rgba(245, 246, 247, 1);
    opacity: 0.8;
  }
}

.cropped {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

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
</style>
