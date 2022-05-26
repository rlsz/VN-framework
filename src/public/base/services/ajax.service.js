import axios from 'axios'
import {LoggerService} from "../../logger/logger.service";
import {LoadingService} from "../../base/services/loading.service";
import {serializeParams, SimpleSubject} from "../../base/utils";
import ProgressBarDialog from "../../base/components/progress-bar-dialog.vue"
import {DialogService} from "../../dialogs/dialog.service";
import {Position} from "@/public/dialogs";

const virtual_a = document.createElement('a')

/**
 * reference: https://github.com/axios/axios
 *
 * 2022-0122 因java接收数组时不支持特殊符号'['和']'，所以使用axios的paramsSerializer配置修改params的序列化格式
 * 预计将影响所有请求中params含有数组和嵌套object的数据，其他类型的数据不受影响(number、string、boolean转成string，undefined、null不传)
 *
 * 例如
 * 参数 a:[1,3,5]
 * 调整前 aaa[]=1&aaa[]=3&aaa[]=5
 * 调整后 a=1&a=3&a=5
 *
 * 参数 bbb: {ccc: [2,4,6],ddd: 'asihdiow'}
 * 调整前 bbb=%7B%22ccc%22:[2,4,6],%22ddd%22:%22asihdiow%22%7D
 * 调整后 bbb=%7B%22ccc%22:%5B2,4,6%5D,%22ddd%22:%22asihdiow%22%7D
 */
export class AjaxService {
    static useClass(token) {
        return {
            provide: AjaxService,
            useClass: token
        }
    }

    injector

    get ls() {
        return this.injector.get(LoggerService)
    }

    get ds() {
        return this.injector.get(DialogService)
    }

    get progressAnchor() {
        const id = 'progress-bar-anchor'
        let temp = document.getElementById(id)
        if (!temp) {
            temp = document.createElement('span')
            temp.id = id
            temp.style.position = 'fixed'
            temp.style.right = '20px'
            temp.style.top = '40px'
            temp.style.pointerEvents = 'none'
            document.body.appendChild(temp)
        }
        return temp
    }

    host
    loading

    constructor(injector, host = process.env.VUE_APP_SERVE) {
        this.injector = injector
        this.host = (host + '/').replace(/\/{2,}$/, '/')
        this.loading = injector.get(LoadingService)
    }

    getAbsolutePath(relativePath) {
        virtual_a.href = this.host + relativePath.replace(/^\//, '')
        return virtual_a.href
    }

    getUrl(path, params = null) {
        let url
        if (path.startsWith('http://') || path.startsWith('https://')) {
            url = path
        } else if (path.startsWith('./') || path.startsWith('../')) {
            url = this.getAbsolutePath(path)
        } else {
            url = this.host + path.replace(/^\//, '')
        }
        if (params && Object.keys(params).length) {
            if (url.indexOf('?') < 0) {
                url += '?'
            }
            url += serializeParams(params)
        }
        return url
    }

    get(url, params, config) {
        return this.interceptor(headers => axios.get(
            this.getUrl(url),
            {
                paramsSerializer: function (params) {
                    return serializeParams(params)
                },
                validateStatus: function () {
                    return true
                },
                ...config,
                params,
                headers
            }
        ), config, params)
    }

    post(url, data, config) {
        let progress, progressBar
        if (config && config.progress) {
            progress = new SimpleSubject(0)
            progressBar = this.ds.open(ProgressBarDialog, {
                data: progress,
                desc: config.progress,
                anchor: this.progressAnchor,
                position: Position.left,
                disableClose: true
            })
        }
        return this.interceptor(headers => axios.post(
            this.getUrl(url),
            data,
            {
                paramsSerializer: function (params) {
                    return serializeParams(params)
                },
                validateStatus: function () {
                    return true
                },
                onUploadProgress(progressEvent) {
                    if (progress) {
                        const {loaded, total} = progressEvent
                        progress.next(loaded / total)
                    }
                },
                ...config,
                headers
            }
        ), config, data).finally(() => {
            if (progressBar) {
                progressBar.close()
            }
        })
    }

    put(url, data, config) {
        return this.interceptor(headers => axios.put(
            this.getUrl(url),
            data,
            {
                paramsSerializer: function (params) {
                    return serializeParams(params)
                },
                validateStatus: function () {
                    return true
                },
                ...config,
                headers
            }
        ), config, data)
    }

    delete(url, data, config) {
        return this.interceptor(headers => axios.delete(
            this.getUrl(url),
            {
                paramsSerializer: function (params) {
                    return serializeParams(params)
                },
                validateStatus: function () {
                    return true
                },
                ...config,
                data,
                headers
            }
        ), config, data)
    }

    // ajax: headers => Promise<{status: number, data: any}>
    interceptor(ajax, originalConfig, data) {
        let config
        const temp = () => this.interceptorBefore(originalConfig, data)
            .then(res => {
                config = res
            }).then(() => {
                config.loading && this.loading.increase()
                return ajax(config.headers)
            }).finally(() => {
                config.loading && this.loading.decrease()
            }).then(res => {
                return this.interceptorAfter(res, temp, config)
            })
        return temp().then(res => {
            if (res.status !== 200) {
                throw res
            }
            return res.data
        }).then(res => {
            if (res instanceof Blob || res instanceof File) {
                return res
            }
            if (res.code !== 200) {
                throw res
            }
            return res.data
        }).catch(err => {
            if (config.log) {
                this.ls.error(err)
            }
            throw err
        })
    }

    /** config => config
     *
     * @param config
     * @param data
     * @returns {Promise<{headers: {...}}>}
     */
    // eslint-disable-next-line no-unused-vars
    interceptorBefore(config, data) {
        return Promise.resolve({
            log: true,
            popupLog: false,
            token: true,
            retry: true,
            reportProgress: false,
            withCredentials: false,
            loading: true,
            ...config,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                ...config?.headers
            }
        })
    }

    /** response => response
     *
     * @param response:       {
     *                          status,
     *                          message,
     *                          data: {
     *                              code,
     *                              message,
     *                              data
     *                          }
     *                        }
     * @param retryCallback:  () => callback()
     * @param config
     * @returns {Promise<*>}
     */
    // eslint-disable-next-line no-unused-vars
    interceptorAfter(response, retryCallback, config) {
        if (response.data instanceof Blob && response.data.type === "application/json") {
            // axios请求的responseType为blob时，即使服务端响应失败，response.data也会被强制转成blob，必须检测特定的blob并通过FileReader再转回json
            return new Promise((r, j) => {
                const reader = new FileReader();
                reader.addEventListener('abort', j)
                reader.addEventListener('error', j)
                reader.addEventListener('loadend', () => {
                    r(JSON.parse(reader.result))
                })
                reader.readAsText(response.data);
            }).then(data => {
                return {
                    ...response,
                    data
                }
            })
        } else {
            return Promise.resolve(response)
        }
    }
}
