import axios from 'axios'
import {LoggerService} from "../../logger/logger.service";
import {LoadingService} from "../../base/services/loading.service";

const virtual_a = document.createElement('a')

export class AjaxService {
    errorCode = {
        Success: 200,
        LoginTimeout: 401
    }

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
            {...config, params, headers}
        ), config)
    }

    post(url, data, config) {
        return this.interceptor(headers => axios.post(
            this.getUrl(url),
            data,
            {...config, headers}
        ), config)
    }

    // ajax: headers => Promise<{status: number, data: any}>
    interceptor(ajax, config) {
        config = Object.assign({
            log: true,
            popupLog: false,
            token: true,
            retry: true,
            reportProgress: false,
            withCredentials: false,
            loading: true
        }, config);
        const temp = () => Promise.resolve({
            'Content-Type': 'application/json;charset=UTF-8',
            ...config.headers
        }).then(headers => {
            config.loading && this.loading.increase()
            return ajax(headers)
        }).finally(() => {
            config.loading && this.loading.decrease()
        }).then(res => {
            if (res.status !== 200) {
                throw res
            }
            return res.data
        }).then(res => {
            if(res instanceof Blob || res instanceof File) {
                return res
            }
            if (res.code === this.errorCode.LoginTimeout) {
                return this.openLogin().then(isSuccess => {
                    if (!isSuccess) {
                        throw res
                    }
                    if (config.retry) {
                        return temp()
                    }
                    throw new Error('请重新操作');
                })
            } else {
                return res
            }
        })
        return temp().then(res => {
            if(res instanceof Blob || res instanceof File) {
                return res
            }
            if (res.code !== this.errorCode.Success) {
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

    // @returns: Promise<boolean>
    openLogin() {
        throw new Error('openLogin unimplemented')
    }
}
