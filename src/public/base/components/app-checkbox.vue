<template>
  <span class="app-checkbox"
        :class="{active: isActive, loading: loading, disabled:isDisabled}"
        v-bind="{ ...$attrs }"
        v-on="{ ...$listeners, click: onClick }"
  ></span>
</template>

<script>
export default {
  name: "app-checkbox",
  props: ['value', 'disabled'],
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
    },
    isDisabled() {
      return this.disabled === '' || !!this.disabled
    }
  },
  methods: {
    onClick(e) {
      if(this.loading || this.isDisabled) {
        return
      }
      if (!this.$listeners.click) {
        this.submit();
        return;
      }
      this.loading = true
      Promise.resolve(this.$listeners.click(this.getOppositeValue())).finally(() => {
        this.loading = false
      }).then(() => {
        this.submit();
      }).catch(err => {});
    },
    submit() {
      return this.$emit('input', this.getOppositeValue())
    },
    getOppositeValue() {
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
.app-checkbox {
  width: 14px;
  height: 14px;
  user-select: none;
  border: 1px solid #DCDFE6;
  cursor: pointer;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  &.round {
    border-radius: 50%;
  }
  &.loading {
    cursor: progress;
  }
  &.disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
  &.active {
    background-color: #409EFF;
    border-color: #409EFF;
  }
  &:after {
    content: "";
    width: 3px;
    height: 6px;
    border: solid white;
    border-width: 0 1px 1px 0;
    transform: rotate(45deg) translateY(-1px) translateX(-1px);
  }
}
</style>
