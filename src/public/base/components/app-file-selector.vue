<template>
  <div class="file-selector">
    <input ref="input"
           type="file"
           :accept="accept"
           v-on:change="isFolder?onSelectFolder($event.target):onSelect($event.target)"
           :capture="capture"
           :webkitdirectory="isFolder"
    />
    <span v-on:click="onClick()" class="file-selector-content"><slot></slot></span>
  </div>
</template>

<script>
import {ReadImage} from "../utils";
import {MIME_TYPE} from '../mime/mime-type';
import {LoggerService} from "../../logger";

/**
 type MaxWidthOrHeight = { maxWidth?: number; maxHeight?: number; };
 type MaxSide = { maxSide: number };
 type MaxSize = { maxSize: number }; // unit: kb
 type FixedWithOrHeight = { width?: number; height?: number; };

 export type ZipOptions = MaxWidthOrHeight | MaxSide | MaxSize | FixedWithOrHeight;
 */
export default {
  name: 'app-file-selector',
  data() {
    return {}
  },
  di: {
    inject: {
      ls: LoggerService
    }
  },
  props: {
    value: {default: null}, // default null
    accept: {default: ''}, // .xlsx, audio/*, video/*, image/*  (if multi, split by ','), https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
    capture: {default: ''}, // user, environment, https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/capture
    zip: {default: null}, // ZipOptions, eg: {width:2048,height:1920}，'300kb'
    minZipSize: {default: 0}, // kb, default 0 - zip all image
    quality: {default: undefined}, // 0 ~ 1 , default 0.92-image/jpeg 0.80-image/webp
    mime: {default: undefined}, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    webkitdirectory: {default: undefined} // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory
  },
  computed: {
    isFolder() {
      return this.webkitdirectory || this.webkitdirectory === ''
    }
  },
  methods: {
    onClick() {
      this.$refs.input.click()
    },
    setValue(v) {
      this.$emit('input', v)
    },
    onSelectFolder(input) {
      if (input.files && input.files.length) {
        const files = [...input.files]
        input.value = '';
        this.$emit('on-select', files)
        this.setValue(files);
      }
    },
    onSelect(input) {
      const file = input.files && input.files[0];
      if (!file) {
        return;
      }
      this.$emit('on-select', file)
      input.value = '';
      if (!this.zip || (file.size < this.minZipSize * 1024)) {
        this.ls.debug(file.name, `${(file.size / 1024).toFixed(2)}kb`);
        this.setValue(file);
        return;
      }

      this.zipImage(file, this.getTarget.bind(this)).then(res => {
        if (file !== res) {
          this.ls.debug(
              file.name,
              `${(file.size / 1024).toFixed(2)}kb`,
              '=>',
              `${(res.size / 1024).toFixed(2)}kb,`,
              `缩小${((1 - res.size / file.size) * 100).toFixed(2)}%`
          );
        }
        this.setValue(res);
      }).catch(err => {
        this.ls.error(err);
      })
    },
    zipImage(
        img,
        // eslint-disable-next-line no-unused-vars
        getTarget = (w, h, size) => {
          return {width: Math.min(w, 200), height: Math.min(h, 200)}
        }
    ) {
      return ReadImage(img).then(c => {
        const target = getTarget(
            c.width,
            c.height,
            img.size
        );
        this.ls.debug('size change',
            {
              width: c.width,
              height: c.height
            }, '=>', target
        );
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = target.width;
        canvas.height = target.height;
        if (!context) {
          throw new Error('no canvas context 2d');
        }
        context.fillStyle = '#fff';
        context.fillRect(0, 0, target.width, target.height);
        context.drawImage(
            c,
            0,
            0,
            target.width,
            target.height
        );
        return canvas;
      }).then(c => {
        return new Promise((r, j) => {
          try {
            c.toBlob((blob) => {
              if (!blob) {
                j(new Error('no blob'));
                return;
              }

              let fileName = img.name;
              if (this.mime && this.mime !== img.type) {
                const mime = MIME_TYPE.find(mimeType => mimeType.mime === this.mime);
                if (mime) {
                  fileName = fileName.replace(/\.[^.]+/, mime.extension);
                }
              }
              blob.name = fileName;
              blob.lastModifiedDate = new Date();
              r(blob);
            }, this.mime || img.type, this.quality);
          } catch (e) {
            j(e);
          }
        })
      })
    },
    getTarget(w, h, size) {
      if (this.zip.maxSize) {
        const {maxSize} = this.zip;
        /** 测试得出结论：
         * 1、最终图片大小跟图片宽高没有特定联系
         * 2、图片宽高不变的情况下，图片大小经过canvas处理会变大，比例为1.258079639794244
         */
        const rate = Math.sqrt(((size * 1.258079639794244) / 1024 / maxSize) * 2);
        return {
          width: Math.floor(w / rate),
          height: Math.floor(h / rate)
        };
      }
      if (this.zip.maxSide) {
        const {maxSide} = this.zip;
        const rate = Math.max(1, w / maxSide, h / maxSide);
        return {
          width: Math.floor(w / rate),
          height: Math.floor(h / rate)
        };
      }
      if (this.zip.maxWidth || this.zip.maxHeight) {
        const {maxWidth, maxHeight} = this.zip;
        let rate = 1;
        if (maxWidth) {
          rate = Math.max(rate, w / maxWidth);
        }
        if (maxHeight) {
          rate = Math.max(rate, h / maxHeight);
        }
        return {
          width: Math.floor(w / rate),
          height: Math.floor(h / rate)
        };
      }
      if (this.zip.width && this.zip.height) {
        const {width, height} = this.zip;
        return {width: width || w, height: height || h};
      }
      throw new Error('invalid zip value');
    }
  }
}
</script>

<style lang="less" scoped>
.file-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  /*border: 0.06rem solid rgba(234, 234, 234, 1);*/

  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 14px;

  input {
    display: none
  }

  .file-selector-content {
    display: flex;
    position: relative;
    cursor: pointer;
  }
}
</style>
