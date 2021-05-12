# 项目介绍
本项目为vue框架项目，src目录结构为vue项目推荐结构，包含main入口、app页面组件、assets静态资源、public公共模块

## 调试与编译
使用npm以及package.json中预定义的脚本调试和编译，具体的环境配置、脚本配置需要根据项目需求配置，参考文档[vue-cli](https://cli.vuejs.org/config/)

```
// 安装依赖
npm install -g @vue/cli@4.5.9 // 可在任意位置安装
npm install

// 本地调试
npm run serve

```

## 框架设计
基于[vue create](https://cli.vuejs.org/guide/creating-a-project.html#vue-create) 命令生成的代码结构进行修改：
- 添加public代替components作为公共模块，所有的项目级别公共组件、directive、方法、样式全都放在这个文件夹中，并且这个文件夹可以拷贝到任意项目中直接使用
- 添加app文件夹作为组件、模块目录，然后将App.vue移动到这个文件夹下

传统的vue项目会在src目录下作如下配置：
- src
    - assets 资源文件
    - components 公共组件
    - common 其他公共内容 
        - filters
        - directives
        - ...
    - router 路由
    - store 公共状态
    - views 页面组件
    - main.js 入口脚本
    - App.vue 入口组件
    
本项目不再使用这样的结构，而是统一在app目录下创建子目录来容纳组件和模块:
- src
    - app app模块
        - main 主要业务模块
            - index.vue main模块容器
            - main.service.js main模块服务(通常会注入到main模块容器中)
            - router.js main模块路由，将被拼接到上级模块(app)的路由中
            - ... 其他业务组件
        - test 测试模块
            - components 模块子组件
                - compChild.vue 页面内嵌组件
                - TestDialog.vue 页面弹窗组件
                - ...
            - index.vue 模块容器
            - router.js 模块路由
            - ... 其他业务组件
        - app.service.js app模块服务(将被注入到模块容器App.vue中)
        - App.vue app模块容器
        - index.js app模块对外export脚本
        - router.js app模块路由
        - ...
    - assets 资源文件
        - public [公共模块][public]资源文件
        - ...
    - public [公共模块][public]
    - main.js 入口脚本
  
#### 模块
每个模块都包含自己的路由、公共状态(class)、组件、公共组件/弹窗组件/子组件，模块可以嵌套，例如本项目的根模块是app，而main、test两个子模块均嵌套在app内  
模块的构成：
- index.vue 模块容器，通过router-view来控制模块内的页面输出，app模块为App.vue
- router.js 模块路由，app模块的路由与子模块路由配置略有不同，app模块创建router实例，而其他模块则是给router树添加节点
- index.js 模块入口，这个为可选配置，主要是为了封闭模块内部结构，如果模块规模比较大的话建议配置一下
- *.service.js 模块公共状态，以class的形式封装一些模块级别的状态处理，例如模块公共数据、模块组件相互沟通的事件总线等等，按照依赖注入机制(di)进行使用
- *.vue 页面组件，需要配合router.js配置页面路径，建议使用webpackChunkName按模块名称分包
- components 模块级别的公共组件，例如弹窗、页面公共子组件等
    - index.js 模块封闭处理，目前仅用于模块公共组件打包，模块页面可以使用`components: {...ModuleComponents}`一次性注册所有模块级别的公共组件

模块公共组件示例：
```
// 将 test/components/compParent.vue、test/components/compChild.vue 作为test模块公共组件使用
// components/index.js
import compParent from "./compParent";
import compChild from "./compChild";
export const ModuleComponents = {
    compParent,
    compChild
}
// test/test2.vue
<compParent>
    <compChild></compChild>
</compParent>

import {ModuleComponents} from './components'
components: {
    ...ModuleComponents
}
```

#### public
参考[公共模块][public]

###### env
公共模块依赖一些环境配置：
- VUE_APP_DEBUG 用于配置是否debug模式，可以开启/关闭vant的vconsole以及LoggerService的控制台日志
- VUE_APP_SERVE AjaxService默认服务地址

#### test_build
nodejs服务，支持history路由，用于测试dist构建包
```
// 进入test_build目录
cd test_build
// 安装依赖
npm install
// 启动nodejs服务
npm start // 根据控制台输出的localhost地址访问本地服务
```


[public]: ./src/public/README.md
