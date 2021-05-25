import axios from 'axios'
import {LoggerService} from "../../logger/logger.service";
import {LoadingService} from "../../base/services/loading.service";

const virtual_a = document.createElement('a')

export class AjaxService {

    ls
    host
    loading

    constructor(injector, host = process.env.VUE_APP_SERVE) {
        this.ls = injector.get(LoggerService)
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
        return this.interceptor(headers => axios.post(
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

    // ajax: headers => Promise<{status: number, data: any}>
    interceptor(ajax, originalConfig, data) {
        return this.interceptorBefore(originalConfig, data).then(config => {
            const temp = () => Promise.resolve(config.headers)
                .then(headers => {
                    config.loading && this.loading.increase()
                    return ajax(headers)
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
        return Promise.resolve(response)
    }
}
