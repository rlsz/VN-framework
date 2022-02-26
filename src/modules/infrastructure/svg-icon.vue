<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners"/>
  <component v-else-if="$options.components[componentName]"
             :is="componentName"
             :class="svgClass"
             aria-hidden="true"
             v-on="$listeners"
  ></component>
</template>

<script>
function encodeComponentName(str) {
  return btoa(encodeURIComponent(str)).replace(/=/g, '-')
}

function decodeComponentName(str) {
  return decodeURIComponent(atob(str.replace(/-(?=[-]*$)/g, '=')))
}

function requireAll(requireContext, group = '') {
  return requireContext.keys().reduce((obj, fileName) => {
    let componentName = fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    componentName = 'icon-' + (group ? group + '-' : '') + encodeComponentName(componentName)
    obj[componentName] = requireContext(fileName)
    return obj
  }, {})
}

const icons = requireAll(require.context('@/assets/svg', false, /\.svg$/))
// const iconsSvg = requireAll(require.context('@/assets/svg', false, /\.svg$/), 'svg')

function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/** 所有的图标将会以组件的形式组册到components中，为避免重名，图标文件名被添加 icon- 前缀进行命名
 * 例如 menu-user-account 对应组件名为 icon-menu-user-account ，对应文件名 menu-user-account.svg
 */
export default {
  name: 'svg-icon',
  components: {...icons},
  props: {
    iconClass: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    group: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.name || this.iconClass)
    },
    componentName() {
      return 'icon-' + (this.group ? this.group + '-' : '') + encodeComponentName(this.name || this.iconClass)
    },
    svgClass() {
      return ['svg-icon ', this.className, this.componentName].filter(c => c).join(' ')
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.name || this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.name || this.iconClass}) no-repeat 50% 50%`
      }
    }
  }
}
</script>

<style lang="less" scoped>
.svg-icon {
  //width: 1em;
  //height: 1em;
  width: 16px;
  height: 16px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;

  --fill-color: currentColor;
  /deep/ [fill="#FFFFFF"],[fill="#333333"],[fill="#323232"],[fill="#D1D1D1"],[fill="#999999"] {
    fill: var(--fill-color);
  }
  /deep/ [stroke="#FFFFFF"],[stroke="#333333"],[stroke="#323232"],[stroke="#D1D1D1"],[stroke="#999999"] {
    stroke: var(--fill-color);
  }
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
