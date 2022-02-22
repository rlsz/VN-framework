<template>
  <div class="flex vertical">
    <span>测试keep-alive是否可以手动清除特定页面的缓存</span>
    <div class="flex">
      <span v-link="'/test/cacheTest'">缓存页主页</span>
      <button class="app-form" @click="kah.clear()">清除全部缓存</button>
    </div>
    <div class="flex">
      <span v-link="'/test/cacheTest/cacheTest1'">缓存页1</span>
      <button class="app-form" @click="kah.clear('/test/cacheTest/cacheTest1')">清除缓存1</button>
    </div>
    <div class="flex">
      <span v-link="'/test/cacheTest/cacheTest2'">缓存页2</span>
      <button class="app-form" @click="kah.clear('/test/cacheTest/cacheTest2')">清除缓存2</button>
    </div>
    <div class="flex">
      <span v-link="'/test/cacheTest/cacheTest3'">缓存页3</span>
      <button class="app-form" @click="kah.clear('/test/cacheTest/cacheTest3')">清除缓存3</button>
    </div>
<!--    <router-view v-slot="{Component, route}">-->
<!--      <keep-alive ref="keepAlive"><component :key="route.path" :is="Component" /></keep-alive>-->
<!--    </router-view>-->
    <div>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import {KeepAliveHelper} from "@/public/base";

export default {
  name: "cacheTest",
  di: {
    providers: [KeepAliveHelper],
    inject: {
      kah: KeepAliveHelper
    }
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
