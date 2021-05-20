import {LoggerService} from '../../logger/logger.service';
import {Source} from '../../logger/logger';
import {serialize, deserialize} from "../utils";

export class CookieStorageService {

    defaultOptions = {
        expires: null, // Date
        secure: null,
        samesite: null,
        'max-age': 0, // number in seconds
        path: '/',
        domain: location.hostname
    }

    get cookies() {
        const query = {};
        const search = document.cookie;
        const reg = /;?\s*([^;=]+)\s*=\s*([^;]+)\s*/g;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const match = reg.exec(search);
            if (match) {
                query[RegExp.$1] = RegExp.$2;
            } else {
                break;
            }
        }
        return query;
    }

    logger

    constructor(injector) {
        this.logger = injector.get(LoggerService)
    }

    serialize(val) {
        return serialize(val);
    }

    deserialize(value) {
        try {
            return deserialize(value)
        } catch (e) {
            this.logger.error(Source.frontend, 'deserialize failed:', value);
            return value
        }
    }

    // getExpiresTime(seconds) {
    //     const t = new Date();
    //     t.setSeconds(t.getSeconds() + seconds);
    //     return t;
    // }

    // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
    _set(name, str, options) {
        options = Object.assign({
            ...this.defaultOptions
        }, options)
        let temp = name + '=' + encodeURIComponent(str)
        Object.keys(options).forEach(key => {
            if (options[key]) {
                let val = options[key]
                if (key === 'expires') {
                    val = val.toGMTString()
                }
                temp += `; ${key}=${val}`
            }
        })
        document.cookie = temp
    }

    _get(name) {
        const val = this.cookies[name]
        return val ? decodeURIComponent(this.cookies[name]) : val
    }

    set(key, value, options) {
        try {
            this._set(key, this.serialize(value), options);
        } catch (e) {
            this.logger.error(Source.frontend, 'Can not save to cookie storage: ', e);
        }
    }

    get(key) {
        return this.deserialize(this._get(key));
    }

    getAll() {
        const allCookies = this.cookies
        return Object.keys(allCookies).reduce((obj, key) => {
            obj[key] = this.deserialize(decodeURIComponent(allCookies[key]))
            return obj
        }, {})
    }

    remove(key) {
        this._set(key, '', {
            expires: new Date(null)
        })
    }

    removeAll() {
        const allCookies = this.cookies
        Object.keys(allCookies).forEach(key => this.remove(key))
    }
}
