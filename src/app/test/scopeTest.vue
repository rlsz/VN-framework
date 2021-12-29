<template>
  <div class="flex vertical">
    <span>scopeTest works</span>
    <scope-inner>
      <span>default slot</span>
      <span slot="test">test slot</span>
<!--      <template v-slot="{value}">-->
<!--        {{value}}-->
<!--      </template>-->
      <template v-slot:value="{value}">
        {{value}}
      </template>
    </scope-inner>
    <span>**********</span>
    <scope-transparent>
      <span>default slot</span>
      <span slot="test">test slot</span>
<!--      <template v-slot="{value}">-->
<!--        {{value}}-->
<!--      </template>-->
      <template v-slot:value="{value}">
        {{value}}
      </template>
    </scope-transparent>
  </div>
</template>

<script>
import scopeInner from "@/app/test/components/scope-inner";
import scopeTransparent from "@/app/test/components/scope-transparent";
export default {
  name: "scopeTest",
  components: {
    scopeInner,
    scopeTransparent
  }
}
</script>

<style scoped>

</style>
