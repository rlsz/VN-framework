<template>
  <div class="flex vertical">
    <div v-tooltip.top="'test tooltip'">short tooltip</div>
    <div v-tooltip.bottom="'test tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltiptest tooltip'">long tooltip</div>
    <div v-tooltip.top="comp">component tooltip</div>
    <div v-tooltip.top="renderComp">function tooltip</div>
  </div>
</template>

<script>
import comp from './components/compChild'
export default {
  name: "tooltipTest",
  data() {
    return {
      comp: comp
    }
  },
  methods: {
    renderComp(createElement, componentInstance, directiveContext, optionsRef) {
      return createElement('div', 'jdlsakjdlaskjdl')
      // console.log(this, h, h === createElement, arguments)
      // return (<div>test tooltip function</div>)
    }
  }
}
</script>

<style scoped>

</style>
