import container from './index.vue'
import {CreateKeepAliveRouter, GetQuery} from "@/public/base";

export default {
    path: '/test',
    component: container,
    meta: {
        title: '测试'
    },
    children: [
        {
            path: '',
            redirect: 'test1'
        },
        {
            path: 'test1',
            component: () => {
                const a = GetQuery().test
                if (a) {
                    return import(/* webpackChunkName: "test" */ `./${a}.vue`)
                }
                return import(/* webpackChunkName: "test" */ './test1.vue')
            },
            meta: {
                title: '测试页1'
            }
        },
        {
            path: 'test2',
            component: () => import(/* webpackChunkName: "test" */ './test2.vue'),
            meta: {
                title: '测试页2'
            }
        },
        {
            path: 'test3',
            component: () => import(/* webpackChunkName: "test" */ './test3.vue'),
            meta: {
                title: '测试页3'
            }
        },
        {
            path: 'logger',
            component: () => import(/* webpackChunkName: "test" */ './logger.vue'),
            meta: {
                title: '日志'
            }
        },
        {
            path: 'dialog',
            component: () => import(/* webpackChunkName: "test" */ './dialog.vue'),
            meta: {
                title: '弹窗'
            }
        },
        {
            path: 'popupTest',
            component: () => import(/* webpackChunkName: "test" */ './popupTest.vue'),
            meta: {
                title: '弹层测试'
            }
        },
        {
            path: 'scroll',
            component: () => import(/* webpackChunkName: "test" */ './scroll.vue'),
            meta: {
                title: '滚动分页'
            }
        },
        {
            path: 'stickyContainer',
            component: () => import(/* webpackChunkName: "test" */ './stickyContainer.vue'),
            meta: {
                title: '轮播'
            }
        },
        {
            path: 'table',
            component: () => import(/* webpackChunkName: "test" */ './table.vue'),
            meta: {
                title: 'table-bridge组件-query'
            }
        },
        {
            path: 'table4',
            component: () => import(/* webpackChunkName: "test" */ './table4.vue'),
            meta: {
                title: 'table-bridge组件--data'
            }
        },
        {
            path: 'table1',
            component: () => import(/* webpackChunkName: "test" */ './table1.vue'),
            meta: {
                title: '自定义table样式'
            }
        },
        {
            path: 'table2',
            component: () => import(/* webpackChunkName: "test" */ './table2.vue'),
            meta: {
                title: '自定义table组件-data'
            }
        },
        {
            path: 'table3',
            component: () => import(/* webpackChunkName: "test" */ './table3.vue'),
            meta: {
                title: '自定义table组件-query'
            }
        },
        {
            path: 'ajax',
            component: () => import(/* webpackChunkName: "test" */ './ajaxTest.vue'),
            meta: {
                title: 'ajax测试'
            }
        },
        {
            path: 'cookieTest',
            component: () => import(/* webpackChunkName: "test" */ './cookieTest.vue'),
            meta: {
                title: 'cookie测试'
            }
        },
        {
            path: 'persistenceTest',
            component: () => import(/* webpackChunkName: "test" */ './persistenceTest.vue'),
            meta: {
                title: '持久化测试'
            }
        },
        {
            path: 'uploadImage',
            component: () => import(/* webpackChunkName: "test" */ './uploadImage.vue'),
            meta: {
                title: '图片压缩测试'
            }
        },
        {
            path: 'uploadFolder',
            component: () => import(/* webpackChunkName: "test" */ './uploadFolder.vue'),
            meta: {
                title: '上传文件夹测试'
            }
        },
        {
            path: 'keepAlive',
            component: {
                render(h) {
                    return h('router-view')
                }
            },
            meta: {
                title: 'keep alive测试'
            },
            children: [
                {
                    path: '',
                    redirect: 'keep-alive-test-1'
                },
                CreateKeepAliveRouter([
                    {
                        path: 'keep-alive-test-1',
                        component: () => import(/* webpackChunkName: "test" */ './keepAlive-1.vue'),
                        meta: {
                            title: 'test 1'
                        }
                    },
                    {
                        path: 'keep-alive-test-2',
                        component: () => import(/* webpackChunkName: "test" */ './keepAlive-2.vue'),
                        meta: {
                            title: 'test 2'
                        }
                    }
                ], [
                    {
                        path: 'keep-alive-test-3',
                        component: () => import(/* webpackChunkName: "test" */ './keepAlive-3.vue'),
                        meta: {
                            title: 'test 3'
                        }
                    },
                    {
                        path: 'keep-alive-test-4/:id',
                        component: () => import(/* webpackChunkName: "test" */ './keepAlive-4.vue'),
                        meta: {
                            title: 'test 4'
                        }
                    }
                ])
            ]
        },
        {
            path: 'diTest',
            component: () => import(/* webpackChunkName: "test" */ './diTest.vue'),
            meta: {
                title: '依赖注入状态测试'
            }
        },
        {
            path: 'richText',
            component: () => import(/* webpackChunkName: "test" */ './richText.vue'),
            meta: {
                title: '富文本编辑测试'
            }
        },
        {
            path: 'formTest',
            component: () => import(/* webpackChunkName: "test" */ './formTest.vue'),
            meta: {
                title: '表单测试'
            }
        },
        {
            path: 'mixinTest',
            component: () => import(/* webpackChunkName: "test" */ './mixinTest.vue'),
            meta: {
                title: 'mixin测试'
            }
        },
        {
            path: 'movie',
            component: () => import(/* webpackChunkName: "test" */ './movie.vue'),
            meta: {
                title: 'movie测试'
            }
        },
        {
            path: 'guide',
            component: () => import(/* webpackChunkName: "test" */ './guide.vue'),
            meta: {
                title: '引导测试'
            }
        },
        {
            path: 'guide1',
            component: () => import(/* webpackChunkName: "test" */ './guide1.vue'),
            meta: {
                title: '引导测试1'
            }
        },
        {
            path: 'gridTest',
            component: () => import(/* webpackChunkName: "test" */ './grid-test.vue'),
            meta: {
                title: 'grid测试'
            }
        },
        {
            path: 'dragTest',
            component: () => import(/* webpackChunkName: "test" */ './dragTest.vue'),
            meta: {
                title: 'drag测试'
            }
        },
        {
            path: 'dragTest1',
            component: () => import(/* webpackChunkName: "test" */ './dragTest1.vue'),
            meta: {
                title: 'drag测试1'
            }
        },
        {
            path: 'testTree',
            component: () => import(/* webpackChunkName: "test" */ './testTree.vue'),
            meta: {
                title: 'tree测试1'
            }
        },
    ]
}
