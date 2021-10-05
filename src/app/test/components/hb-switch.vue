<template>
  <span class="hb-switch flex cross-center"
        :class="{active: isActive, loading: loading}"
        v-bind="{ ...$attrs }"
        v-on="{ ...$listeners, click: onClick }"
  >
    <span class="active-text">
      <slot name="active"></slot>
      <slot></slot>
    </span>
    <span class="inactive-text">
      <slot name="inactive"></slot>
      <slot></slot>
    </span>
    <i class="hb-switch-dot"></i>
  </span>
</template>

<script>
export default {
  name: "hb-switch",
  props: ['value'],
  data() {
    return {
      loading: false
    }
  },
  computed: {
    isActive() {
      if(typeof this.value === 'boolean') {
        return this.value
      }
      if(typeof this.value === 'number') {
        return !!this.value
      }
      return false
    }
  },
  methods: {
    onClick(e) {
      if(this.loading) {
        return
      }
      if (!this.$listeners.click) {
        this.submit();
        return;
      }
      this.loading = true
      Promise.resolve(this.$listeners.click(this.getValue())).finally(() => {
        this.loading = false
      }).then(() => {
        this.submit();
      }).catch(err => {});
    },
    submit() {
      return this.$emit('input', this.getValue())
    },
    getValue() {
      if(typeof this.value === 'boolean') {
        return !this.value
      }
      if(typeof this.value === 'number') {
        return  Number(!this.value)
      }
      return true
    }
  }
}
</script>

<style lang="less" scoped>
.hb-switch {
  min-width: 50px;
  width: fit-content;
  height: 24px;
  border-radius: 12px;
  background-color: #999;
  cursor: pointer;
  padding: 0 2px;

  line-height: 24px;
  font-style: normal;
  font-size: 12px;
  color: #fff;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  &.loading {
    cursor: progress;
  }
  i.hb-switch-dot {
    content: "";
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #fff;
    order: 1;
    flex: 0 0 auto;
    pointer-events: none;
  }
  .inactive-text, .active-text {
    order: 2;
    flex: 1 0 auto;
    min-width: 0px;
    padding: 0 5px;
  }

  &.active {
    background-color: #4c7cee;
    .inactive-text {
      display: none;
    }
    i.hb-switch-dot {
      order: 3;
    }
  }
  &:not(.active) {
    .active-text {
      display: none;
    }
  }
}
</style>
