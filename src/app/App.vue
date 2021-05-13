<template>
  <div id="app" class="flex" v-platform>
    <app-menu :value="menu" v-if="!inner"></app-menu>
    <span v-if="inner" class="flex cross-center" style="padding: 8px 4px;">
      <i v-link="'/'" class="arrow left"></i>
      <span style="margin: auto;">{{title}}</span>
    </span>
    <div class="flex fill-content vertical" v-show="inner">
      <router-view/>
    </div>
  </div>
</template>

<script>

import {AppService} from "./app.service";
import appMenu from './app-menu.vue'
import {menus} from "./router";
import {Platform, PlatformService} from "@/public/platform";

export default {
  name: 'App',
  components: {appMenu},
  di: {
    providers: [
      {provide: AppService, useValue: AppService.instance}
    ],
    inject: {
      as: AppService,
      ps: PlatformService
    }
  },
  data() {
    return {
      menu: menus
    }
  },
  computed: {
    inner() {
      return this.ps.platform === Platform.mobile && this.$route.matched && this.$route.matched.length
    },
    title() {
      return this.$route.meta?.title || ''
    }
  },
  created() {
    console.log(this.as.aaa)
    setTimeout(() => {
      this.as.test = 'test alskjdlaskjd'
      this.$set(this.as, 'test2', [{
        a: 'aa',
        b: 'bb',
      }])
      // this.as.test2 = [{
      //   a: 'aa',
      //   b: 'bb',
      // }]
      setTimeout(() => {
        this.as.test2.push({
          c: 'cc',
          d: 'dd'
        })
        // this.$set(this.as.test2, 1, {
        //   c: 'cc',
        //   d: 'dd'
        // })
      }, 1000)
    }, 2000)
  }
}
</script>

<style lang="less">
#app {
  flex: 1 1 0px;
  overflow: hidden;
  color: rgba(51, 51, 51, 1);

  .container {
    flex: 1 1 0px;
  }
  &.mobile {
    flex-direction: column;
    .app-menu-root {
      flex: 1 1 0px;
    }
    > .fill-content {
      width: auto;
    }
  }
}

//@media (max-width: 800px) {
//  #app {
//    flex-direction: column;
//    > .fill-content {
//      width: auto;
//    }
//    .app-menu {
//      flex-basis: auto;
//      flex-direction: row;
//      overflow-y: hidden;
//      overflow-x: auto;
//    }
//  }
//}
</style>
