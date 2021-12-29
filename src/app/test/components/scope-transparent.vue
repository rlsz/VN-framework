<template>
  <div class="flex vertical">
    <span>scope transparent</span>
    <scopeInner>
      <template v-for="(_, slot) of $slots" :slot="slot">
        <span>[slot-{{slot}}]</span>
        <slot :name="slot"/>
      </template>
      <template v-for="(_, scopedSlot) of $scopedSlots" v-slot:[scopedSlot]="scope">
        <span>[scopedSlot-{{scopedSlot}}]</span>
        <slot :name="scopedSlot" v-bind="scope"/>
      </template>
    </scopeInner>
  </div>
</template>

<script>
import scopeInner from "@/app/test/components/scope-inner";
export default {
  name: "scope-transparent",
  components: {scopeInner},
  created() {
    console.log('$slots', this.$slots)
    console.log('$scopedSlots', this.$scopedSlots)
  }
}
</script>

<style scoped>

</style>
