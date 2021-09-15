import axios from 'axios'
import {LoggerService} from "../../logger/logger.service";
import {LoadingService} from "../../base/services/loading.service";
import {SimpleSubject} from "../../base/utils";
import ProgressBarDialog from "../../base/components/progress-bar-dialog.vue"
import {DialogService} from "../../dialogs/dialog.service";
import {Position} from "@/public/dialogs";

const virtual_a = document.createElement('a')

export class AjaxService {

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
        if(!temp) {
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
            url += Object.keys(params).map((p) => {
                return p + '=' + params[p]
            }).join('&')
        }
        return url
    }

    get(url, params, config) {
        return this.interceptor(headers => axios.get(
            this.getUrl(url),
            {
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
        if(config && config.progress) {
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
                validateStatus: function () {
                    return true
                },
                onUploadProgress(progressEvent) {
                    if(progress) {
                        const { loaded, total } = progressEvent
                        progress.next(loaded / total)
                    }
                },
                ...config,
                headers
            }
        ), config, data).finally(() => {
            progressBar.close()
        })
    }

    put(url, data, config) {
        return this.interceptor(headers => axios.put(
            this.getUrl(url),
            data,
            {
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
        if(response.data instanceof Blob && response.data.type === "application/json") {
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
