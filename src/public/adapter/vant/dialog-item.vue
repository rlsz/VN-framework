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
  // render(h) {
  //   return h('el-dialog', {
  //     props: {
  //       title: 'placeholder',
  //       ...this.options.instance.config,
  //       visible: true,
  //       'before-close': () => {
  //         this.options.instance.close()
  //       }
  //     }
  //   }, [
  //     h(this.options.vueComponent)
  //   ])
  // },
  // https://vuejs.org/v2/guide/render-function.html#createElement-Arguments
  render(h) {
    return h('van-popup', {
      props: {
        ...this.options.instance.config,
        value: true,
        'close-on-click-overlay': false,
        'overlay-class': this.options.instance.config?.transparent ? 'transparent' : ''
      },
      on: {
        'click-overlay': () => {
          this.options.instance.close()
        }
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

<style scoped>
/deep/ .el-dialog--center .bridge-el-dialog > .header > :first-child {
  margin-left: auto;
}
/deep/ .el-dialog--center .bridge-el-dialog > .footer {
  text-align: center;
}
</style>
