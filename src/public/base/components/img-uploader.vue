<template>
  <app-dialog-bridge class="img-uploader">
    <span slot="title">上传图片</span>
    <div v-if="status === CropStatus.init || status === CropStatus.ready" style="align-self: center;">
      <app-file-selector class="photo-selector"
                         v-model="file"
                         accept="image/*"
                         :zip="{ maxWidth: 2048, maxHeight: 2048 }"
                         capture="user"
                         :mime="croppedConfig.type"
      >
        <div class="flex vertical center image-box">
          <img v-if="fileUrl" :src="fileUrl"/>
          <span v-else>选择图片</span>
        </div>
      </app-file-selector>
    </div>
    <div v-if="status === CropStatus.cropping" style="align-self: center;max-width: 100%;" class="flex vertical cross-center">
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
          :style="{width: imgInfo.w + 'px', height: imgInfo.h + 'px'}"
      ></vue-cropper>
      <app-scale-bar v-model="currentScale" @input="changeScale"></app-scale-bar>
    </div>
    <div v-if="status === CropStatus.cropped" class="flex vertical center image-box">
      <img :src="croppedFileUrl" :style="{width: croppedImgInfo.w+'px',height:croppedImgInfo.h+'px'}"/>
    </div>
    <span class="flex" slot="footer" style="align-self: flex-end;">
      <button class="app-form" @click="startCrop" v-if="status === CropStatus.ready">剪裁</button>
      <button class="app-form" @click="cancelCrop" v-if="status === CropStatus.cropping || status === CropStatus.cropped">取消剪裁</button>
      <button class="app-form" @click="finishCrop" v-if="status === CropStatus.cropping">预览</button>
      <button class="app-form" @click="onSubmit" :disabled="status === CropStatus.cropping || status === CropStatus.init">上传</button>
    </span>
  </app-dialog-bridge>
</template>

<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import {GetImageInfo} from "../../base/utils";
import {Dialog} from "../../dialogs/dialog";

const CropStatus = {
  init: 1,
  ready: 2,
  cropping: 3,
  cropped: 4
}
export default {
  components: {
    VueCropper
  },
  di: {
    inject: {
      dialog: Dialog
    }
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
      },
      imgInfo: null,
      croppedImgInfo: null,
      CropStatus,
      status: CropStatus.init
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
    file(val) {
      if(val) {
        GetImageInfo(val).then(res => {
          this.imgInfo = res
          this.$nextTick(() => {
            if (this.file && this.$refs.cropper) {
              this.$refs.cropper.replace(this.fileUrl);
            }
          })
          this.status = CropStatus.ready
        })
      }
    },
    croppedFile(val) {
      if(val) {
        GetImageInfo(val).then(res => {
          this.croppedImgInfo = res
          this.status = CropStatus.cropped
        })
      }
    }
  },
  methods: {
    startCrop() {
      this.status = CropStatus.cropping
      this.$nextTick(() => {
        this.$refs.cropper.replace(this.fileUrl);
      })
    },
    cancelCrop() {
      this.status = CropStatus.ready
    },
    changeScale() {
      this.$refs.cropper.scale(1 + this.currentScale * 10);
    },
    finishCrop() {
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
            // width: this.croppedConfig.width,
            // height: this.croppedConfig.height,
            fillColor: '#fff'
          })
          .toBlob((blob) => {
            blob.name = this.file?.name;
            blob.lastModifiedDate = new Date();

            this.croppedFile = blob
          }, this.croppedConfig.type);
    },
    onSubmit() {
      if(this.status === CropStatus.ready) {
        this.dialog.close(this.file)
      } else if(this.status === CropStatus.cropped) {
        this.dialog.close(this.croppedFile)
      }
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

.photo-selector.file-selector {
  display: inline-flex;
}
.image-box {
  min-width: 100px;
  min-height: 100px;
  border: 1px solid #e3e3e3;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
}
.cropper {
  align-self: center;
  flex: 0 0 auto;
  max-width: 100%;
  max-height: 100%;
  min-width: 100px;
  min-height: 100px;
  background: rgba(245, 246, 247, 0.8);

  /deep/ .cropper-drag-box.cropper-modal {
    background: rgba(245, 246, 247, 1);
    opacity: 0.8;
  }
}
.scale-bar {
  max-width: 300px;
  align-self: center;
}

</style>
