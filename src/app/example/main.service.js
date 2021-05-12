import {AppService} from "@/app/app.service";
import {AjaxService} from "@/public/base";

export class MainAjaxService extends AjaxService {
    constructor(injector) {
        super(injector, 'https://sentrywardtest.aigauss.com/');
    }
    post(...args) {
        console.log('MainAjaxService args:', ...args)
        return super.post(...args)
    }
}

export class Test {
    someService

    constructor(injector) {
        this.someService = injector.get(SomeService)
        this.someService.test()
    }

    diCreated(vm) {
        console.log(vm)
    }

    diMounted() {

    }

    diDestroyed() {

    }
}

export class SomeService {
    form
    as
    list = []

    constructor(injector) {
        this.as = injector.get(AppService)
    }

    test() {
        console.log('SomeService test')
    }

    getData() {
        return new Promise(r => {
            setTimeout(() => {
                r([
                //     {
                //     "id": 5,
                //     "name": "股票",
                //     "type": 0,
                //     "category": "stock",
                //     "ambiguity": true,
                //     "source": 2,
                //     "modelId": null,
                //     "dbId": null,
                //     "dataScript": null,
                //     "checked": null,
                //     "isActive": true,
                //     "datasourceDbId": 4,
                //     "createTime": 1604389849000,
                //     "updateTime": 1610093207000,
                //     "intervalTime": 50,
                //     "timeUnit": 1,
                //     "parentId": null,
                //     "subCategories": []
                // }, {
                //     "id": 7,
                //     "name": "基金",
                //     "type": 0,
                //     "category": "fund",
                //     "ambiguity": false,
                //     "source": 2,
                //     "modelId": null,
                //     "dbId": null,
                //     "dataScript": null,
                //     "checked": null,
                //     "isActive": true,
                //     "datasourceDbId": 5,
                //     "createTime": 1604390248000,
                //     "updateTime": 1610093211000,
                //     "intervalTime": 30,
                //     "timeUnit": null,
                //     "parentId": null,
                //     "subCategories": []
                // }, {
                //     "id": 8,
                //     "name": "地区",
                //     "type": 0,
                //     "category": "region",
                //     "ambiguity": false,
                //     "source": 2,
                //     "modelId": 0,
                //     "dbId": null,
                //     "dataScript": null,
                //     "checked": null,
                //     "isActive": true,
                //     "datasourceDbId": 48,
                //     "createTime": 1604734651000,
                //     "updateTime": 1610093213000,
                //     "intervalTime": 30,
                //     "timeUnit": 1,
                //     "parentId": null,
                //     "subCategories": []
                // }, {
                //     "id": 32,
                //     "name": "概念",
                //     "type": 2,
                //     "category": "concept",
                //     "ambiguity": false,
                //     "source": 1,
                //     "modelId": 1,
                //     "dbId": null,
                //     "dataScript": null,
                //     "checked": null,
                //     "isActive": false,
                //     "datasourceDbId": 0,
                //     "createTime": 1606963693000,
                //     "updateTime": 1610155296000,
                //     "intervalTime": 30,
                //     "timeUnit": null,
                //     "parentId": null,
                //     "subCategories": []
                // }, {
                //     "id": 45,
                //     "name": "地区QU",
                //     "type": 0,
                //     "category": "region_qu",
                //     "ambiguity": false,
                //     "source": 2,
                //     "modelId": 0,
                //     "dbId": null,
                //     "dataScript": null,
                //     "checked": null,
                //     "isActive": false,
                //     "datasourceDbId": 48,
                //     "createTime": 1604734651000,
                //     "updateTime": 1610155292000,
                //     "intervalTime": 1800,
                //     "timeUnit": 2,
                //     "parentId": null,
                //     "subCategories": []
                // }, {
                //     "id": 49,
                //     "name": "标签test",
                //     "type": 0,
                //     "category": "bq",
                //     "ambiguity": false,
                //     "source": 1,
                //     "modelId": 0,
                //     "dbId": null,
                //     "dataScript": null,
                //     "checked": null,
                //     "isActive": false,
                //     "datasourceDbId": 0,
                //     "createTime": 1607585953000,
                //     "updateTime": 1610091530000,
                //     "intervalTime": 10,
                //     "timeUnit": 1,
                //     "parentId": null,
                //     "subCategories": []
                // },
                    {
                    "id": 52,
                    "name": "标签test",
                    "type": 2,
                    "category": "",
                    "ambiguity": false,
                    "source": null,
                    "modelId": 1,
                    "dbId": null,
                    "dataScript": null,
                    "checked": null,
                    "isActive": false,
                    "datasourceDbId": 0,
                    "createTime": 1607946335000,
                    "updateTime": 1609901068000,
                    "intervalTime": null,
                    "timeUnit": 1,
                    "parentId": null,
                    "subCategories": []
                }, {
                    "id": 56,
                    "name": "ceshi_1228",
                    "type": 0,
                    "category": "ceshi",
                    "ambiguity": false,
                    "source": 2,
                    "modelId": 0,
                    "dbId": null,
                    "dataScript": null,
                    "checked": null,
                    "isActive": false,
                    "datasourceDbId": 54,
                    "createTime": 1609138812000,
                    "updateTime": 1610091519000,
                    "intervalTime": 10000,
                    "timeUnit": 1,
                    "parentId": null,
                    'hasChildren': true, // 这个字段会导致el-table的tree结构失效
                    "subCategories": [{
                        "id": 61,
                        "name": "test1",
                        "type": 2,
                        "category": "",
                        "ambiguity": false,
                        "source": null,
                        "modelId": 1,
                        "dbId": null,
                        "dataScript": null,
                        "checked": null,
                        "isActive": false,
                        "datasourceDbId": 0,
                        "createTime": 1610372058000,
                        "updateTime": 1610372058000,
                        "intervalTime": null,
                        "timeUnit": 1,
                        "parentId": 56,
                        "subCategories": []
                    }]
                }, {
                    "id": 62,
                    "name": "标签test",
                    "type": 2,
                    "category": "",
                    "ambiguity": false,
                    "source": null,
                    "modelId": 1,
                    "dbId": null,
                    "dataScript": null,
                    "checked": null,
                    "isActive": false,
                    "datasourceDbId": 0,
                    "createTime": 1607946335000,
                    "updateTime": 1609901068000,
                    "intervalTime": null,
                    "timeUnit": 1,
                    "parentId": null,
                    "subCategories": []
                }])
            }, 2000)
        }).then(res => {
            this.list = res
            return res
        })
    }

    diCreated() {
        // this.getData()
        setTimeout(() => {
            this.as.test = '111111111'
        }, 3000)
    }
}
