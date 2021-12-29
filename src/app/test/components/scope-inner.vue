<template>
  <div class="flex vertical">
    <span>scope inner</span>
    <span>
      slot: <slot></slot>
    </span>
    <span>
      slot test: <slot name="test"></slot>
    </span>
    <span>
      scoped slot: <slot v-bind:value="'test scoped'"></slot>
    </span>
    <span>
      scoped slot value: <slot name="value" v-bind:value="'test scoped value'"></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: "scope-inner"
}
</script>

<style scoped>

</style>
