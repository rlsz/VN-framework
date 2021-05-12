import {Source} from "@/public/logger";

export function GetQuery(str) {
    const query = {};
    const search = str || location.search;
    const reg = /(?:\?|&)([^?&=]+)=([^&=]+)/g;
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


// get random number from min to max, include min but exclude max.
export function GetRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function GetRandomString(len = 32) {
    // 去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1:'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    const $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}


// export function FormatDate(date, format = 'yyyy-MM-dd HH:mm:ss') {
//   if (isNaN(date)) {
//     return '-';
//   } else {
//     return formatDate(date, format, 'en-US');
//   }
// }

/** 格式化日期(可添加新的短语)
 *  '2020-03-09 14:13:20.756 星期一'
 *  'yyyy-MM-dd HH:mm:ss.nnn 星期w'
 */
export function FormatDate(d, format = 'yyyy-MM-dd HH:mm:ss') {
    if (!d) {
        return '-';
    }
    let date;
    if (typeof d === 'number') {
        if (isNaN(d)) {
            return '-';
        }
        date = new Date(d);
    } else if (typeof d === 'string') {
        date = new Date(d.replace(/-/g, '/').replace(/T/, ' '));
        if (isNaN(date.getTime())) {
            return d;
        }
    } else {
        date = d;
    }
    if (!date) {
        return '-';
    }
    if (format) {
        const rules = {
            'y+': date.getFullYear(),
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'n+': date.getMilliseconds()
        };
        for (const rule in rules) {
            if (new RegExp(`(${rule})`).test(format)) {
                const str = rules[rule] + '';
                const len = RegExp.$1.length;
                if (len <= str.length) {
                    format = format.replace(RegExp.$1, str);
                } else {
                    const fillStr = new Array(len).fill(0).join('') + str;
                    format = format.replace(RegExp.$1, fillStr.substring(str.length));
                }
            }
        }
        const weekMap = ['日', '一', '二', '三', '四', '五', '六'];
        const w = date.getDay();
        format = format.replace('w', weekMap[w]);
        return format;
    } else {
        return date.toLocaleString();
    }
}

// function test(input: string): Observable<string[]> {
//   return of(input).pipe(
//     map(c => [c])
//   );
// }
//
// const bbb = fromEvent(document, 'keyup').pipe(
//   map((c: KeyboardEvent) => c.key),
//   tap(c => console.log('key stroke', c)),
//   debounceInput(packageName => test(packageName))
// );
//
// console.log('test util start');
// bbb.subscribe(data => {
//   console.log('test util', data);
// });

export function RoundNumber(num, digits = 0) {
    if (typeof num !== 'number') {
        return num;
    }
    const temp = Math.pow(10, digits);
    const sign = num < 0 ? -1 : 1;
    return sign * Math.round(num * sign * temp) / temp;
}

export function Distinct(arr, compare = (a, b) => a === b) {
    return arr.reduce((list, item) => {
        if (!list.some(c => compare(c, item))) {
            list.push(item);
        }
        return list;
    }, []);
}

// export type JsType = 'Array' | 'String' | 'Symbol' | 'Number' | 'Null' | 'Undefined' | 'Object' | 'RegExp' | 'Date' | 'Boolean' | 'HTMLAnchorElement' | string;
export function GetJsType(val) {
    return Object.prototype.toString.apply(val).match(/\[object\s([a-zA-Z]+)\]/)[1];
}

export function ReadImage(img) {
    return new Promise((r, j) => {
        try {
            const reader = new FileReader()
            reader.onload = c => {
                const imgTag = new Image()
                if (typeof c.target.result === 'string') {
                    imgTag.src = c.target.result
                    imgTag.onload = () => {
                        r(imgTag)
                    }
                } else {
                    // throw new Error('c.target.result is not string');
                    j(new Error('c.target.result is not string'))
                }
            }
            reader.readAsDataURL(img)
        } catch (e) {
            j(e)
        } finally {
            // todo: dispose
        }
    })
}

export function GetImageInfo(img) {
    return ReadImage(img).then(c => {
        return {
            w: c.width,
            h: c.height,
            size: img.size,
            name: ('name' in img && img.name) || 'unknown',
            type: img.type
        };
    });
}

export class SimpleSubject {
    _value = undefined
    cbs = []

    _isDone = false

    constructor(value) {
        if (value !== undefined) {
            this.next(value)
        }
    }

    next(value) {
        if (this._isDone) {
            throw new Error('can\'t emit value after subject done')
        }
        this._value = value
        const cbs = this.cbs.map(c => c)
        cbs.forEach(c => {
            c.fn(value)
        })
    }

    subscribe(fn, errFn, completeFn) {
        const item = {fn, errFn, completeFn}
        this.cbs.push(item)
        const _this = this
        return {
            unsubscribe() {
                _this.cbs.splice(_this.cbs.indexOf(item), 1)
            }
        }
    }

    complete() {
        if (this._isDone) {
            throw new Error('can\'t complete after subject done')
        }
        this._isDone = true
        this.cbs.forEach(c => {
            c.completeFn && c.completeFn()
        })
    }

    error(err) {
        if (this._isDone) {
            throw new Error('can\'t throw error after subject done')
        }
        this._isDone = true
        this.cbs.forEach(c => {
            c.errFn && c.errFn(err)
        })
    }
}

export function SimpleClone(obj) {
    return JSON.parse(JSON.stringify(obj))
}

// unit: ms
// eslint-disable-next-line no-unused-vars
export function debounceTime(func, time = 500) {
    const _this = this
    let resolve, reject
    let timer

    function refresh(args) {
        if (timer) {
            clearTimeout(timer)
            // reject('aborted')
        }
        timer = setTimeout(() => {
            timer = null
            try {
                resolve(func.apply(_this, args))
            } catch (e) {
                reject(e)
            }
        }, time)
    }

    return function () {
        return new Promise((r, j) => {
            refresh(arguments)
            resolve = r
            reject = j
        })
    }
}

/** throttle executor
 * bufferLength: max execution at same time
 * compare: ignore same execution in queue or buffer
 * return: a function to add new execution
 * executor: () => Promise<any>
 * @param bufferLength
 * @returns {function(*=): void}
 */
export function throttle(executor, bufferLength, compareKey) {
    const queue = []
    let buffer = new Array(bufferLength).fill(undefined)

    function refresh() {
        buffer.forEach((c, i) => {
            c === undefined && flush(i)
        })
    }

    function flush(i) {
        if (buffer[i] !== undefined) {
            return
        }
        if (queue.length) {
            buffer[i] = queue.shift()
            Promise.resolve(
                executor.call(...buffer[i])
            ).finally(() => {
                buffer[i] = undefined
                flush(i)
            })
        }
    }

    return function (...args) {
        const item = [this, ...args]
        if(compareKey) {
            const key = compareKey.call(...item)
            if([...queue, ...buffer.filter(c => c !== undefined)].some(c => key === compareKey.call(...c))) {
                return
            }
        }
        queue.push(item)
        refresh()
    }
}

/** throttle for promise callback
 * bufferLength: max execution at same time
 * callback: () => Promise<any>
 *
 * @param bufferLength
 * @returns {function(*=): void}
 */
export function throttlePromise(bufferLength) {
    const executor = throttle(cb => cb(), bufferLength)
    // callback: () => Promise<any>
    return function add(callback) {
        executor(callback)
    }
}

// const add = throttlePromise(2)
// add(() => {
//     return new Promise(r => {
//         setTimeout(() => {
//             console.log(1)
//             r(true)
//         }, 3000)
//     })
// })
// add(() => {
//     return new Promise(r => {
//         setTimeout(() => {
//             console.log(2)
//             r(true)
//         }, 3000)
//     })
// })
// add(() => {
//     return new Promise(r => {
//         setTimeout(() => {
//             console.log(3)
//             r(true)
//         }, 3000)
//     })
// })

export function ForceRepaint() {
    const body = document.body
    if (body) {
        body.style.display = 'none';
        body.offsetHeight; // no need to store this anywhere, the reference is enough
        body.style.display = '';
    }
}

/** flatten tree structure to one dimension key-value data
 * e.g. flattenTree(tagsTree, tag => tag.id, tag => tag.subTagCategoryDtos)
 * @param tree - source array
 * @param keySelector - key selector: node => key
 * @param subTreeSelector - sub tree selector: node => sub tree
 * @param seed - result container
 * @returns {*}
 */
export function flattenTreeToMap(tree, keySelector, subTreeSelector, seed = {}) {
    if (!subTreeSelector) {
        throw new Error('subTreeSelector is required')
    }
    if (!tree) {
        return seed
    }
    if (!(tree instanceof Array)) {
        tree = [tree]
    }
    return tree.reduce((res, node) => {
        const key = keySelector(node)
        if (!res[key]) {
            res[key] = node
        } else {
            console.warn(`duplicate node ${key} -`, node)
        }
        const subTree = subTreeSelector(node)
        if (subTree && subTree.length) {
            res = flattenTreeToMap(subTree, keySelector, subTreeSelector, res)
        }
        return res
    }, seed)
}

export function flattenTreeToArray(tree, subTreeSelector, seed = []) {
    if (!subTreeSelector) {
        throw new Error('subTreeSelector is required')
    }
    if (!tree) {
        return seed
    }
    if (!(tree instanceof Array)) {
        tree = [tree]
    }
    return tree.reduce((res, node) => {
        res.push(node)
        const subTree = subTreeSelector(node)
        if (subTree && subTree.length) {
            res = flattenTreeToArray(subTree, subTreeSelector, res)
        }
        return res
    }, seed)
}

if (!Array.prototype.distinct) {
    Array.prototype.distinct = function (compare) {
        return Distinct(this, compare)
    }
}

export function serialize(val) {
    return (typeof val) + '|' + JSON.stringify(val);
}

export function deserialize(val) {
    if (!val) {
        return val;
    }
    let prefix = val.match(/^(string|undefined|object|number|boolean)\|/);
    if (prefix) {
        prefix = prefix[0];
        val = val.replace(prefix, '');
        prefix = prefix.substring(0, prefix.length - 1);
        if (prefix === 'undefined') {
            val = undefined;
        } else {
            val = JSON.parse(val);
        }
    }
    return val;
}

export function timer(span) {
    return new Promise(r => {
        setTimeout(() => {
            r(undefined)
        }, span)
    })
}

export function CreateKeepAliveRouter(cacheRouters, noCacheRouters = []) {
    if(GetJsType(cacheRouters) !== 'Array') {
        cacheRouters = [cacheRouters]
    }
    if(GetJsType(noCacheRouters) !== 'Array') {
        noCacheRouters = [noCacheRouters]
    }
    return {
        path: '',
        component: {
            render(h) {
                return h('keep-alive', {}, [
                    h('router-view')
                ])
            }
        },
        children: [
            ...cacheRouters,
            {
                path: '',
                component: {
                    data() {
                        return {
                            show: null
                        }
                    },
                    activated() {
                        this.show = false
                        this.$nextTick(() => {
                            if (this.show === false) {
                                this.show = true
                            }
                        })
                    },
                    deactivated() {
                        this.show = null
                    },
                    render(h) {
                        if (this.show) {
                            return h('router-view')
                        } else {
                            return ''
                        }
                    }
                },
                children: [
                    ...noCacheRouters
                ]
            }
        ]
    }
}

export function GeneratorFactory(prefix) {
    function* newID() {
        let i = 1;
        while (true) {
            yield prefix + i++;
        }
    }

    const generator = newID();

    return () => {
        return generator.next().value;
    }
}

