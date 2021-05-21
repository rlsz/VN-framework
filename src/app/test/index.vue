<template>
  <div class="page-frame frame-padding">
    <div class="body">
      <div class="flex wrap">
        <router-link
            v-for="item in menus"
            :key="item.path"
            :to="item.path"
            :class="{ 'active': routePath === item.path }"
        >
          {{ item.title }}
        </router-link>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {menuAdapter} from "../menuAdapter";
import router from "./router";
import {PlatformService, Platform} from "@/public/platform";

export default {
  di: {
    inject: {
      ps: PlatformService
    }
  },
  data() {
    return {
      Platform
    }
  },
  computed: {
    menus() {
      return menuAdapter(router.children, router.path + '/')
    },
    routePath() {
      return this.$route.path
    }
  },
  created() {
  }
}
</script>

<style lang="less" scoped>
a {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  padding: 0 12px;

  &.router-link-active {
    color: green;
  }

  &.router-link-exact-active {
    color: #42b983;
  }
}

.body {
  padding: 8px 20px;
}

.header {
  overflow-x: auto;
}
</style>
