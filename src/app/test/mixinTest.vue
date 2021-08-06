<template>
  <div>mixin test</div>
</template>

<script>
import {AjaxService} from "@/public/base";
import {ConfigService} from "@/public";

const mixin = {
  di: {
    providers: [ConfigService],
    inject: {
      ajax: AjaxService
    }
  },
  beforeCreate() {
    console.log(this.$options.name, 'mixin beforeCreate', this.$options.di)
  },
  created() {
    console.log(this.$options.name, 'mixin created', this.ajax)
  }
}
export default {
  name: "mixinTest",
  mixins: [mixin],
  di: {
    inject: {
      config: ConfigService,
      // ajax: ConfigService
    }
  },
  beforeCreate() {
    console.log(this.$options.name, 'component beforeCreate', this.$options.di)
  },
  created() {
    console.log(this.$options.name, 'component created', this.ajax)
  }
}
</script>

<style scoped>

</style>
