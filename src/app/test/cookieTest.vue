<template>
  <div>
    <pre>{{cookieString}}</pre>
    <button class="app-form" @click="refresh">refresh</button>
    <button class="app-form" @click="add">add</button>
    <button class="app-form" @click="del">delete</button>
  </div>
</template>

<script>
import {LoggerService} from "@/public/logger";
import {DialogService} from "@/public/dialogs";
import {CookieStorageService} from "@/public/base";

export default {
  di: {
    inject: {
      ls: LoggerService,
      ds: DialogService,
      cs: CookieStorageService
    }
  },
  data() {
    return {
      cookieString: ''
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    refresh() {
      this.cookieString = JSON.stringify(this.cs.getAll(), null, '  ')
    },
    add() {
      this.cs.set('test', '123', {
        'max-age': 15 * 24 * 60 * 60 // 15 days
      })
      this.refresh()
    },
    del() {
      this.cs.remove('test')
      this.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
button {
  margin: 10px 5px;
}
</style>
