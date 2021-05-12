<script>
// import Vue from 'vue'
import {Dialog} from "../../dialogs/dialog";

export default {
  name: "dialog-item",
  props: ['options'],
  di: {
    providers: [{
      provide: Dialog,
      useFactory() {
        return this.$options.propsData.options.instance
      }
    }]
  },
  // https://vuejs.org/v2/guide/render-function.html#createElement-Arguments
  render(h) {
    return h('el-dialog', {
      props: {
        title: 'placeholder',
        ...this.options.instance.config,
        visible: true,
        'before-close': () => {
          this.options.instance.close()
        },
        'custom-class': this.options.instance.config?.transparent ? 'transparent' : ''
      }
    }, [
      h(this.options.vueComponent)
    ])
  },
  // beforeCreate() {
  //   this.$injector.set({
  //     provide: Dialog,
  //     useValue: this.$options.propsData.options.instance
  //   })
  // },
  mounted() {
    // this.$nextTick(() => {
    //   this.$refs.container.parentElement.appendChild(this.createDom(this.options));
    //   this.options.instance.setOpen();
    // })
  },
  methods: {
    // reference: https://vuejs.org/v2/api/#propsData
    // createDom(d) {
    //   const Component = Vue.extend(d.vueComponent);
    //   const instance = new Component({
    //     propsData: {
    //       dialog: d.instance,
    //       config: Object.assign({}, d.config)
    //     }
    //   });
    //   instance.$mount();
    //   return instance.$el;
    // }
  }
}
</script>

<style lang="less" scoped>

</style>
