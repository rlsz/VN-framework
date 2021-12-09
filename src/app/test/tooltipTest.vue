<template>
  <div class="flex vertical">
    <div v-tooltip.top="'test tooltip'">short tooltip</div>
    <div v-tooltip.bottom="'test tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltip'">long tooltip</div>
    <div v-tooltip.top="comp">short tooltip</div>
    <div v-tooltip.top="getComp">short tooltip</div>
  </div>
</template>

<script>
export default {
  name: "tooltipTest",
  data() {
    return {
      comp: {
        render() {
          return (<div>test tooltip component</div>)
        }
      }
    }
  },
  methods: {
    getComp() {
      return {
        render() {
          return (<div>test tooltip function</div>)
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
