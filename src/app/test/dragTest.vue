<template>
  <div class="flex vertical">
    <span :class="{active:isActive('drag-1')}" id="drag-1" draggable="true">item to drag 1</span>
    <span :class="{active:isActive('drag-2')}" id="drag-2" @dragstart="ondragstart">item to drag 2 (invalid drag: no draggable attribute)</span>
    <span :class="{active:isActive('drag-3')}" id="drag-3" draggable="true" @dragstart="ondragstart" @dragend="ondragend">item to drag 3, allow move</span>
    <span :class="{active:isActive('drag-4')}" id="drag-4" draggable="true" @dragstart="ondragstartCopy" @dragend="ondragend">item to drag 4, allow copy</span>
    <span :class="{active:isActive('target-1')}" id="target-1" @drop="ondrop" @dragenter="ondragenter" @dragleave="ondragleave">target to drop 1 (invalid drop: no dragover listener)</span>
    <span :class="{active:isActive('target-2')}" id="target-2" @dragover="ondragover">target to drop 2</span>
    <span :class="{active:isActive('target-3')}" id="target-3" @drop="ondrop" @dragover="ondragover" @dragenter="ondragenter" @dragleave="ondragleave">target to drop 3, allow move</span>
    <span :class="{active:isActive('target-4')}" id="target-4" @drop="ondrop" @dragover="ondragoverCopy" @dragenter="ondragenter" @dragleave="ondragleave">target to drop 4, allow copy</span>
  </div>
</template>

<script>

import {debounceTime} from "@/public/base";

export default {
  name: "dragTest",
  data() {
    return {
      dragoverRef: null,
      dragTarget: null
    }
  },
  created() {
  },
  mounted() {
    this.dragoverRef = debounceTime((e) => {
      this.ondragoverRoot.call(this, e)
    }, 50)
    // this.dragoverRef = this.ondragoverRoot.bind(this)
    this.$el.addEventListener('dragover', this.dragoverRef, false)
  },
  destroyed() {
    this.$el.removeEventListener('dragover', this.dragoverRef, false)
  },
  methods: {
    isActive(id) {
      return this.dragTarget?.id === id
    },
    ondragstart(ev) {
      let img = new Image();
      img.src = require('../../assets/public/file_none_icon@2x.png');
      ev.dataTransfer.setDragImage(img, 30/2, 30/2);

      // const canvas = document.createElement("canvas");
      // canvas.width = canvas.height = 50;
      // canvas.style['align-self'] = 'center'
      // const ctx = canvas.getContext("2d");
      // ctx.lineWidth = 4;
      // ctx.moveTo(0, 0);
      // ctx.lineTo(50, 50);
      // ctx.moveTo(0, 50);
      // ctx.lineTo(50, 0);
      // ctx.stroke();
      // document.body.appendChild(canvas)
      // ev.dataTransfer.setDragImage(canvas, 25, 25);

      ev.dataTransfer.effectAllowed = "move";
      ev.dataTransfer.setData("text/plain", ev.target.id);
      ev.dataTransfer.setData("text/html", ev.target.outerHTML);
      console.log('ondragstart', ev.target.id, ev.dataTransfer.getData("text/plain"), ev.dataTransfer.getData("text/html"), ev)
    },
    ondragstartCopy(ev) {
      ev.dataTransfer.effectAllowed = "copy";
      ev.dataTransfer.setData("text/plain", ev.target.id);
      ev.dataTransfer.setData("text/html", ev.target.outerHTML);
      console.log('ondragstart', ev.target.id, ev.dataTransfer.getData("text/plain"), ev.dataTransfer.getData("text/html"), ev)
    },
    ondragend(ev) {
      if(ev.dataTransfer.dropEffect === 'move') {
        console.log('ondragend', ev.target.id, ev.dataTransfer.getData("text/plain"), ev.dataTransfer.getData("text/html"), ev, ev.dataTransfer.dropEffect)
      } else {
        console.log('ondragend cancel', ev, ev.dataTransfer.dropEffect)
      }
      this.dragTarget = null
    },
    ondrop(ev) {
      ev.preventDefault();
      console.log('ondrop', ev.target.id, ev.dataTransfer.getData("text/plain"), ev.dataTransfer.getData("text/html"), ev, ev.dataTransfer.dropEffect)
    },
    ondragover(ev) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move";
      // console.log('ondragover', ev.target.id, ev.dataTransfer.getData("text/plain"), ev.dataTransfer.getData("text/html"), ev)
    },
    ondragoverCopy(ev) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "copy";
    },
    ondragenter(ev) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "copy";
      console.log('ondragenter', ev.target.id, ev.dataTransfer.getData("text/plain"), ev.dataTransfer.getData("text/html"), ev, ev.dataTransfer.types)
    },
    ondragleave(ev) {
      console.log('ondragleave', ev.target.id, ev.dataTransfer.getData("text/plain"), ev.dataTransfer.getData("text/html"), ev)
    },
    ondragoverRoot(ev) {
      // console.log('ondragoverRoot', ev.target.id, ev.dataTransfer.getData("text/plain"), ev.dataTransfer.getData("text/html"), ev)
      this.dragTarget = ev.target
    }
  }
}
</script>

<style lang="less" scoped>
.active {
  border-bottom: 1px solid green;
}
</style>
