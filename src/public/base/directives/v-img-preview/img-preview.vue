<template>
  <div class="img-preview-container" @click="dialog.close()">
    <img :src="dialog.config.src"/>
  </div>
</template>

<script>
import {Dialog} from "../../../dialogs/dialog";

export default {
  name: "img-preview",
  di: {
    inject: {
      dialog: Dialog
    }
  }
}
</script>

<style lang="less" scoped>
.img-preview-container {
  display: block;
  overflow: auto;
  padding: 20px;
  cursor: zoom-out;
}

img {
  max-width: 100%;
}

</style>
