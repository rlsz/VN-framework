# 公共组件

本公共组件库目标是创建所有vue项目的通用component/directive/filter/function等任意通用内容    
组件、样式通过index.js注册到Vue中：
```
// main.js
import {router, App} from './app'
import publicModule, {RootProviders} from '@/public'
Vue.use(publicModule, router)
```
公共服务需要在创建Vue根实例时把RootProviders注册到di中：
```
// main.js
import "@/public/styles/global.less" // 全局样式在旧页面中应该注释掉(会影响已有页面样式)，新项目可以使用
import publicModule, {RootProviders} from '@/public'
new Vue({
  di: {
    providers: [...RootProviders]
  },
  router,
  render: h => h(App)
}).$mount('#app')
```

#### di
依赖注入mixin，提供一种树结构的状态定义，目的是代替vuex的全局状态定义，
providers定义的class会在对应组件上绑定class实例，
inject定义的key-value会被混入组件data中，其中value会沿着组件树向上遍历查找
  
使用示例：
```
// public/index.js
export const RootProviders = [{
    provide: LoggerService,
    useValue: LoggerService.instance
}, {
    provide: DialogService,
    useValue: DialogService.instance
}]

// main.js vue根组件
di: {
    providers: [...RootProviders]
}

// app/App.vue app模块容器
di: {
    providers: [{provide: AppService, useValue: AppService.instance}],
    inject: {
      as: AppService
    }
}

// app/main/index.vue main模块容器
di: {
    providers: [SomeService]
}

// app/main/Home.vue main模块页面
di: {
    providers: [Test],
    inject: {
      test: Test, // 搜索到当前组件providers提供的实例
      ss: SomeService, // 搜索到父组件app/main/index.vue中的实例
      as: AppService // 搜索到app/App.vue中的实例
    }
}

// app/test/components/TestDialog.vue test模块的弹窗测试组件
di: {
    inject: {
      dialog: Dialog, // 搜索到dialog-item中提供的Dialog实例
      ds: DialogService // 搜索到vue根组件中提供的DialogService实例(通过RootProviders引入)
    }
}
```
值得注意的是弹窗组件的父组件并非调用弹窗的页面组件，而是：
main.js中定义的vue根组件 --> dialogs-container --> dialog-item --> (dialog-bridge -->) 弹窗组件，
因此，如果弹窗组件需要通过di系统与父组件的依赖建立联系，则必须通过config手动配置：
```
// 示例代码，不一定是最佳实践
// test/dialog.vue
this.ds.open(TestDialog, {
    parent: this
})
// test/components/TestDialog.vue
di: {
    providers: [
      {
        provide: AppService,
        useFactory(injector) {
          return injector.get(Dialog).config?.parent?.$injector.get(AppService) || null // 默认值null表示provider存在但为空，不会导致di报错
        }
      }
    ],
    inject: {
      as: AppService
    }
}
```

###### 依赖注入相关术语
简而言之，di配置项providers用于创建实例，inject用于使用实例，两者通过Token建立联系，配置形式如下：  
```
 di: {
     providers: [
      Token, // class引用或构造函数
      {
          provide: Token,
          useValue: instance // 使用某个具体的class实例或固定值
      },
      {
          provide: Token,
          useClass: OtherToken // 使用其他Token创建实例，常用于有继承关系的Token使用
      },
      {
          provide: Token,
          useExisting: OtherToken // 使用其他Token已有的实例，常用于interface的使用
      },
      {
          provide: Token,
          useFactory: injector => instance // 使用自定义回调方法创建实例，需要注意的是返回undefined会导致实例查询报错(遍历搜索时将被跳过导致查询失败)，建议使用null表达空值
      }
     ],
     inject: {
         key: Token
     }
 }
```
术语：
- Token: Class, e.g. es6 Class reference or es5 Function constructor  
    es6 class引用或es5构造函数，用于唯一标记provider
- provider: an object or class instance identified by Token  
    依赖注入基本单元，配置项providers数组中的元素，可以是单个的Token或者provide为Token的对象
- provide: configuration of provider, must be Token
    provider配置项之一，必须为Token
- factory: a callback function to generate a provider  
    配置项useFactory的值，用于自定义创建provider实例的回调函数
- instanceMap: key - Token symbol, value - provider  
    依赖注入系统内使用的缓存表，使用key-value的形式存储Token与provider实例，Token会使用InjectionSymbol属性进行标记
- injector: a DependencyInjection instance bounded with vue component instance, one by one  
    di系统为每个Vue component实例创建的依赖注入实例，与组件一一绑定，因此具备树形结构
- providers: a provider config list used to generate instanceMap  
    di配置项之一，支持多种配置形式，可以查看术语上面的'di配置形式'的解释
- inject: mixin all inject key-value to component's data, the value is found by hierarchical injector  
    di配置项之一，key-value将被混入到组件的data中，value会根据Token沿着父组件向根组件搜索遍历

## base

#### components
基础组件

###### emotion.vue
使用svg写的数值图标组件，目前已应用于资讯情感值的展示
```
// test/test2.vue
<app-emotion :value="0.3"></app-emotion>
```

###### file-selector.vue
文件选择组件，通过v-model绑定文件引用，通常情况下还需要使用URL.createObjectURL处理成临时地址在页面中展示
```
// test/test1.vue
<app-file-selector class="photo-selector"
                   v-model="file"
                   accept="image/*"
                   :zip="{ maxWidth: 2048, maxHeight: 2048 }"
                   capture="user"
                   :mime="croppedConfig.type"
>
  <div class="flex vertical center image-box"
       :style="{width: '100px', height: '100px'}">
    <img v-if="fileUrl" :src="fileUrl"/>
    <span v-else>选择图片</span>
  </div>
</app-file-selector>

  data() {
    return {
      file: null
    }
  },
  computed: {
    fileUrl() {
      return this.file ? URL.createObjectURL(this.file) : null
    }
  }
```

###### scale-bar.vue
可以左右拖动的范围选择组件，可以运行项目进入`/test/test1`目录看效果
```
// test/test1.vue，可通过@input事件或watch状态currentScale来触发业务代码
<app-scale-bar v-model="currentScale"></app-scale-bar>
```

###### sticky-container
粘性容器，用于H5轮播效果，用户可以左右拖动触发轮播动画，也可以自动触发轮播动画

可以运行项目进入`/test/stickyContainer`目录看效果
```
// test/stickyContainer.vue
<app-sticky-container class="test-sticky-container" :auto-scroll="3000" loop>
    <template v-if="show">
      <img src="../../assets/public/search_icon.png"/>
      <img src="../../assets/public/no_search.png"/>
      <img src="../../assets/public/icon_minus-circle.png"/>
      <img src="../../assets/public/icon_plus-circle.png"/>
    </template>
    <span v-else>loading</span>
</app-sticky-container>
```

#### utils
公共方法，所有的最底层的公共方法都应该放在这里，例如格式化时间FormatDate、解析图片ReadImage/GetImageInfo、数组去重Distinct等，部分内容使用新的节点来描述

###### SimpleSubject
可订阅数据类型，可以用来实现事件总线等订阅-取消订阅的设计

以`public/base/sticky-container.vue`为例
```
// 创建Subject
data() {
    return {
      events: new SimpleSubject()
    }
}
// 发布新的数据
this.events.next({
    id: t.identifier,
    x: t.pageX,
    y: t.pageY,
    type: e.type,
    time: Date.now(),
    event: e
})
// 订阅Subject
this.sub = this.events.subscribe(e => {
  ...
})
// 取消订阅，防止组件销毁后仍然被触发
destroyed() {
    this.sub && this.sub.unsubscribe()
}
```

###### directives
由于vue directive没有上下文的概念，开发点击拷贝指令(v-copy)时由于事件绑定在bind中，获取最新拷贝内容比较麻烦，所以开发了directive-base来实现指令上下文，同时简化指令注册api

已有指令：  
- v-copy 点击拷贝指令，给任意dom标签添加`v-copy`可拷贝innerText，也可以通过`v-copy="data"`来指定拷贝内容  
- v-html-new 代替v-html绑定innerHTML，该指令设定偏业务，会对html内容做一定的处理，例如修改pre、img标签样式，剥离html、body标签  
- v-limit-line 多行省略号指令，默认1行，可以配置行数，底层使用-webkit-box实现折行省略号，存在部分兼容性问题；  
    部分手机浏览器会看到底部文字碎片，可以增加line-height消除；  
    dom标签不能使用padding，如果必须要用padding的话建议加一层span标签，把指令转移到内层的span标签；  
    ie11等浏览器不支持-webkit-box，多行省略号将被全部处理成单行；  
- v-link router跳转指令，部分场景下可能不习惯原有的router-link用法，可以使用该指令给任意标签绑定点击跳转路由  

###### filters
vue过滤器，类似于angular的pipe

已有过滤器：  
- date 时间格式化，底层调用utils中的FormatDate方法，示例：`<span>{{time | date}}</span>`、`<span>{{time | date('yyyy-MM-dd')}}</span>`  
- highlight 高亮格式化，由于高亮处理结果中包含html代码，所以需要在v-html/v-html-new指令中使用，又因为v-html/v-html-new指令不支持filter语法，所以需要这样用：`v-html="$options.filters.highlight(content, ['word 1','word 2'])"`  
- number 数字格式化，偏业务的组件，用于将数字格式化成带有万/亿等单位的展示形式，`<span>{{data | number}}</span>`

###### services
公共服务

> AjaxService 基于axios的ajax服务设计，依赖di系统进行使用，默认以process.env.VUE_APP_SERVE作为服务地址，默认在main.js中通过RootProviders引入
> LocalStorageService indexDB对接服，可以用于存储任意javascript类型的数据，但有循环引用的数据会报错
```
// app/main/index.vue
  // AjaxService可被子模块自己的class覆盖
  {
    provide: AjaxService,
    useClass: MainAjaxService
  }
  // AjaxService也可使用factory修改服务地址
  {
    provide: AjaxService,
    useFactory(injector) {
      return new AjaxService(injector, 'http://www.test.com')
    }
  }

```

###### mime
根据mdn文档搜集到的[mime]定义，文件上传场景下可能会用到

## logger
日志模块--项目基础模块，用于搜集/展示多种级别、多种来源、任意内容的系统日志
- 日志级别从低到高分为debug、info、warning、success、error，debug级别的日志仅会出现在测试环境的console信息中，production环境下被移除，其他级别的日志输出颜色、图标各不相同
- 日志来源目前没有明确区分，如有业务需求再考虑对接
- 日志参数可以是任意js内容，日志系统会根据内容抽取一个摘要(Log.summary)用于最终输出和显示，测试环境下console会输出原始的日志内容
- info、warning、success、error级别的日志会根据插件进行适配输出

```
// 直接使用单例
LoggerService.instance.success('复制成功')

// app/test/dialog.vue 使用依赖注入
di: {
    inject: {
      ls: LoggerService
    }
}

this.ls.debug('message') // 调试日志，production版本会被忽略
this.ls.info('message', 'another message') // 提示日志，用于对用户进行提示，如操作成功或失败
this.ls.warning('message') // 警告日志，如接口响应过慢、登陆过期
this.ls.success('message') // 成功日志，如保存成功、登录成功
this.ls.error('message') // 错误日志，如网络异常、保存失败

this.ls.info('this', 'is', 'a info log', new Error('请重新操作')) // 参数数量任意，内容任意

// 计时日志
const timer = this.ls.time(method); // method = 'test'
return this.ss.call(method, this.stid, ...args).pipe(
  tap(() => {
    timer.end('call {0} time {t}', Source.quant); // call test time 1.25s
  }, err => {
    timer.end('call {0} time {t}, error happened', err, Source.quant);
  })
);
```

###### error-messages.ts
日志替换表，有些日志需要使用更易懂的文案显示，或者有些日志里面含有敏感的接口/文件路径，这些场景下需要替换原本的日志内容。
###### tokens
- TIME_ALERT 用于定义计时日志Log.time/Log.timeEnd的超时阈值，单位为秒

## dialogs
弹窗基础架构，通过适配优化了el-dialog、van-popup组件的交互方式，弹窗组件需要使用一个独立的组件开发，调用弹窗的方式由旧的visible方式修改为js调用方法进行打开和监听关闭，
使用示例如下：
```
// 直接使用单例
DialogService.instance.open(TestDialog)
// 依赖注入
di: {
    inject: {
      ds: DialogService
    }
}

// app/test/dialog.vue
  this.ds.open(TestDialog, {
    parent: this,
    title: 'test dialog',
    // center: true,
    'before-close': (done, data) => {
      console.log('before close:', data)
      this.ds.confirm('是否关闭弹窗？').then(() => {
        done()
      }).catch(() => {
      });
    }
  }).afterClosed().then(res => {
    this.ls.info('LoginComponent dialog closed:', res);
  });
```
> DialogService的open方法第一个参数为vue组件，第二个参数的内容作为config可以在组件内以及el-dialog、van-popup中使用  
config使用示例
```
// app/test/components/TestDialog.vue
di: {
    inject: {
      dialog: Dialog
    }
}
computed: {
    config() {
      return this.dialog.config
    }
}
```

## styles
框架基础样式，以及一些常用的样式
> 基础样式在app.component中已经配置好了，常用的样式可以结合页面设计使用
###### flex
常用的[flex](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout) 布局  
- 绑定到父元素，作用于父元素：flex、inline、fill、shrink、vertical
- 绑定到父元素，作用于子元素：main-center、cross-center、center、wrap
- 绑定到直接子元素，作用于子元素：shrink、fill-content
###### link
通用样式，使目标元素产生浅蓝色可点击的视觉效果，可配合a标签定义的外链、退出登录span标签定义的点击事件等样式
###### a
通用a标签链接交互效果，定义了初始颜色、hover颜色、hover鼠标效果、.disabled禁用效果
###### bg-gray、bg-white
常用的背景颜色
###### frame-padding
以及页面需要使用该样式动态适应页面大小，维持内容区域宽度最大为1200px
###### invisible
不可见样式，但是仍会占用空间，只是视觉上不可见
> v-if、display:none;造成的不可见效果将不会占用空间

#### icon
通用图标样式，如关闭图标(close)、上/下/左/右方向图标(arrow up/down/left/right)、空内容图标、搜索图标等
#### material
material修正样式，使material组件调整为设计人员切图的风格，public/form/form.scss中有更多样式修正。
#### reset
重置浏览器初始设置，实际效果未知
#### scroll
通用滚动样式，[scroll模块](#scroll)依赖该样式才能使用

## scroll
滚动组件、服务。
- 移动端浏览器通过下拉屏幕可以触发ScrollType.pull_top事件
- 滚动条滚动到距离底部(滚动区域)一定距离时触发ScrollType.pull_bottom事件
```
// 组件内嵌套，通过v-on监听滚动
<app-scroll @pull_top="pull_top" @pull_bottom="pull_bottom">
    <child-comp></child-comp>
</app-scroll>
// 子组件child-comp，通过依赖注入监听滚动
di: {
    inject: {
      ss: ScrollService
    }
}

mounted() {
    this.sub = this.ss.scrollEvents.subscribe(e => {
      if (e.type === ScrollType.pull_top) {
        this.pullTop()
      } else if (e.type === ScrollType.pull_bottom) {
        this.pullBottom()
      }
    })
}

destroyed() {
    if (this.sub) {
      this.sub.unsubscribe()
    }
}
```

###### list-scrollable
可无限滚动的列表组件，pull_bottom事件被触发时调用query方法查询下一页数据，pull_top事件触发时清空数据并重新查询第一页

```
// app/test/scroll.vue
<app-scroll>
  <app-list-scrollable :query="query" :size="50">
    <template v-slot:default="{value}">
      <div>...</div>
    </template>
  </app-list-scrollable>
</app-scroll>

refresh() {
  // query: (page: number, size: number) => Promise<any[]>
  this.query = (page, size) => {
    return ...
  }
}
```

## adapter
适配第三方库例如日志弹出、弹窗处理等，适配这些组件库主要为了简化旧项目的公共组件调整工作，目前已经可以做到public文件夹直接拷贝到旧项目中就能使用的效果

目前项目计划实现三种适配方案：element、vant、default(vue原生方案)，在adapter/index.js中引入适配方案中的一种即可使用

###### element
element-ui适配模块，包含公共模块适配以及部分组件的简化

multi-select-bridge 多选输入框，用法示例
```
// 组件中只需要添加v-model绑定状态以及remote-method查询方法即可使用，需要注意的是必须为模版中的el-option绑定key属性，否则可能造成状态与ui不同步的问题
  <multi-select-bridge
      style="width: 378px;"
      v-model="multiValue1"
      placeholder="多选选择"
      :remote-method="queryOptions"
      value-key="id"
  >
    <template v-slot:default="{value,index}">
      <el-option :key="value.id" :label="value.name" :value="value"></el-option>
    </template>
  </multi-select-bridge>
```
table-bridge 集成了分页功能的table组件，而且处理了树形结构的多选问题(此外还通过改写el-table组件解决了hasChildren的bug)，用法示例
```
// 只需要指定query查询方法即可使用，默认slot与el-table相同，如果需要处理树形结构的数据，则还要添加tree-props以及selection-change参数
  <table-bridge :query="query"
                size="20"
                :tree-props="{children: 'myChildren'}"
                @selection-change="onSelectionChange"
  >
    ...
  </table-bridge>
```

###### default
默认组件，未来开发自己的弹层相关组件，去除对第三方组件的依赖

## table
todo: 暂未完成，目前只有一些基本样式

## form
todo: 暂未完成，目前只有一些基本样式


[mime]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
