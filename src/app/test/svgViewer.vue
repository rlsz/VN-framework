<template>
  <div class="flex vertical" :style="{background: bgColor}">
    <div class="flex">
      <button class="app-form margin-4" @click="changeBackground('white')">白色背景</button>
      <button class="app-form margin-4" @click="changeBackground('gray')">灰色背景</button>
      <button class="app-form margin-4" @click="changeBackground('green')">绿色背景</button>
    </div>
    <span class="margin-4">@/assets/svg:</span>
    <div class="flex wrap">
      <div v-for="icon in icons" class="margin-4 padding-4 flex vertical cross-center border-area" v-copy="icon">
        <svg-icon :name="icon"></svg-icon>
        <span class="margin-top-4">{{icon}}</span>
      </div>
    </div>
  </div>
</template>

<script>
function requireAll(requireContext, group = '') {
  return requireContext.keys().map(fileName => fileName.split('/').pop().replace(/\.\w+$/, ''))
}

const icons = requireAll(require.context('@/assets/svg', false, /\.svg$/))
export default {
  name: "svgViewer",
  data() {
    return {
      icons: icons,
      bgColor: 'white'
    }
  },
  methods: {
    changeBackground(color) {
      this.bgColor = color
    }
  }
}
</script>

<style lang="less" scoped>
.border-area {
  border: 1px dashed gray;
}
</style>
