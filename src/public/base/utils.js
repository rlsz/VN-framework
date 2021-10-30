import {MIME_TYPE} from "./mime/mime-type";

let path = require('path')
export function resolvePath(...paths) {
    return path.resolve(...paths)
}
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

export function GetRandomString(len = 32, exists = []) {
    // 去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1:'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    const $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    if (exists && exists.length) {
        if (exists.indexOf(pwd) >= 0) {
            return GetRandomString(len, exists)
        }
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

// img: Blob、File
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

// https://stackoverflow.com/questions/1977871/check-if-an-image-is-loaded-no-errors-with-jquery
export function IsImageOk(img) {
    // During the onload event, IE correctly identifies any images that
    // weren’t downloaded as not complete. Others should too. Gecko-based
    // browsers act like NS4 in that they report this incorrectly.
    if (!img.complete) {
        return false;
    }

    // However, they do have two very useful properties: naturalWidth and
    // naturalHeight. These give the true size of the image. If it failed
    // to load, either of these should be zero.
    if (img.naturalWidth === 0) {
        return false;
    }

    // No other way of checking: assume it’s ok.
    return true;
}

// img: HTMLImageElement、Image
export function ConvertImageToCanvas(imgTag, outputSize) {
    return new Promise(r => {
        if (IsImageOk(imgTag)) {
            r(imgTag)
        } else {
            imgTag.onload = () => {
                r(imgTag)
            }
        }
    }).then(img => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const {width, height} = outputSize || img
        canvas.width = width;
        canvas.height = height;
        context.fillStyle = '#fff';
        context.fillRect(0, 0, width, height);
        context.drawImage(
            img,
            0,
            0,
            width,
            height
        );
        return canvas;
    })
}

export function ConvertCanvasToBlob(canvas, fileName, mime, quality) {
    return new Promise((r, j) => {
        try {
            canvas.toBlob((blob) => {
                if (!blob) {
                    j(new Error('no blob'));
                    return;
                }

                fileName = fileName || GetRandomString(16) + '.png';
                const temp = MIME_TYPE.find(mimeType => mimeType.mime === (mime || blob.type));
                if (temp) {
                    fileName = fileName.replace(/\.[^.]+$/, temp.extension);
                }

                blob.name = fileName;
                blob.lastModifiedDate = new Date();
                r(blob);
            }, mime, quality);
        } catch (e) {
            j(e);
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
            let res
            try {
                res = Promise.resolve(
                    executor.apply(buffer[i].ref, buffer[i].args)
                )
            } catch (err) {
                res = Promise.reject(err)
            }
            res.then(res => {
                buffer[i].r(res)
            }).catch(err => {
                buffer[i].j(err)
            }).finally(() => {
                buffer[i] = undefined
                flush(i)
            })
        }
    }

    return function (...args) {
        return new Promise((r, j) => {
            const item = { r, j, ref: this, args }
            if (compareKey) {
                const key = compareKey.apply(item.ref, item.args)
                if ([...queue, ...buffer.filter(c => c !== undefined)].some(c => key === compareKey.apply(c.ref, c.args))) {
                    return
                }
            }
            queue.push(item)
            refresh()
        })
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

// time unit: s
export function Tick(time, onTick) {
    if (onTick) {
        onTick(time)
    }
    if (time <= 0) {
        return true
    }
    return timer(1000).then(() => Tick(time - 1, onTick))
}

/**  使用show状态强制刷新的做法会引发router的某种bug：
 * 假设路由被CreateKeepAliveRouter划分为A(外)、B(缓存)、C(内部不缓存)三个区域，
 * 正常情况如下：
 * 1、B1 -> B2 -> B1 -> B2时，B1、B2有缓存效果
 * 2、B -> C -> B -> C时，B有缓存效果而C没有
 * 3、A -> B -> A -> B时，A、B均无缓存效果
 * 但实际上 B -> C -> B -> A 的路由引导会造成router.push完全失效，所以需要放弃状态强制刷新的做法，改为使用exclude；
 * exclude的做法需要满足一个条件：router必须配置name，且component的name必须与router的name相同；
 * 因此需要为noCacheRouters的同步/异步路由创建随机name，需要注意的是路由组件可能存在异步场景，所以exclude并不是在路由返回时初始化完成的，但可以保证在组件创建时初始化完成
 */
export function CreateKeepAliveRouter(cacheRouters, noCacheRouters = []) {
    if (GetJsType(cacheRouters) !== 'Array') {
        cacheRouters = [cacheRouters]
    }
    if (GetJsType(noCacheRouters) !== 'Array') {
        noCacheRouters = [noCacheRouters]
    }
    let exclude = []
    if (noCacheRouters.length) {
        const temp = noCacheRouters.map(r => {
            if (typeof r.component === 'function') {
                return r.component().then(res => {
                    return {
                        ...r,
                        component: res.default
                    }
                })
            } else {
                return Promise.resolve(r)
            }
        })
        Promise.all(temp).then(routers => {
            routers.forEach(r => {
                if (!r.name) {
                    r.name = GetRandomString(16, exclude)
                }
                r.component.name = r.name
                exclude.push(r.name)
            })
        })
    }
    return {
        path: '',
        component: {
            // 寻找替代render语法：试下render里面的children再return render，看第二个render里面有没有scopedSlot，vue2和vue3都试下
            render(h) {
                return h('keep-alive', {
                    props: {exclude}
                }, [
                    h('router-view')
                ])
            }
        },
        children: [
            ...cacheRouters,
            ...noCacheRouters
            // {
            //     path: '',
            //     component: {
            //         data() {
            //             return {
            //                 show: null
            //             }
            //         },
            //         activated() {
            //             this.show = false
            //             this.$nextTick(() => {
            //                 if (this.show === false) {
            //                     this.show = true
            //                 }
            //             })
            //         },
            //         deactivated() {
            //             this.show = null
            //         },
            //         render(h) {
            //             if (this.show) {
            //                 return h('router-view')
            //             } else {
            //                 return ''
            //             }
            //         }
            //     },
            //     children: [
            //         ...noCacheRouters
            //     ]
            // }
        ]
    }
}

export function GeneratorFactory(prefix = 0) {
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

var root = window;

/**
 * Returns the scrolling parent of the given element
 * @function
 * @ignore
 * @argument {Element} element
 * @returns {Element} offset parent
 */
export function getScrollParent(element) {
    var parent = element.parentNode;

    if (!parent) {
        return element;
    }

    if (parent === root.document) {
        // Firefox puts the scrollTOp value on `documentElement` instead of `body`, we then check which of them is
        // greater than 0 and return the proper element
        if (root.document.body.scrollTop || root.document.body.scrollLeft) {
            return root.document.body;
        } else {
            return root.document.documentElement;
        }
    }

    // Firefox want us to check `-x` and `-y` variations as well
    if (
        ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow')) !== -1 ||
        ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-x')) !== -1 ||
        ['scroll', 'auto'].indexOf(getStyleComputedProperty(parent, 'overflow-y')) !== -1
    ) {
        // If the detected scrollParent is body, we perform an additional check on its parentNode
        // in this way we'll get body if the browser is Chrome-ish, or documentElement otherwise
        // fixes issue #65
        return parent;
    }
    return getScrollParent(element.parentNode);
}

/**
 * Get CSS computed property of the given element
 * @function
 * @ignore
 * @argument {Eement} element
 * @argument {String} property
 */
export function getStyleComputedProperty(element, property) {
    // NOTE: 1 DOM access here
    var css = root.getComputedStyle(element, null);
    return css[property];
}

export function truncateText(str, len = 100) {
    if (typeof str !== 'string') {
        return str;
    }
    if (str.length <= len) {
        return str;
    }
    return str.substr(0, len) + '...';
}

// https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
export function ConvertBase64ImageToBlob(imgStr, fileName, sliceSize = 512) {
    if (/^data:(image\/.+);base64,([^,]+)$/g.test(imgStr)) {
        const type = RegExp.$1
        const data = RegExp.$2
        const byteCharacters = atob(data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, {type});

        fileName = fileName || GetRandomString(16) + '.png';
        const mime = MIME_TYPE.find(mimeType => mimeType.mime === type);
        if (mime) {
            fileName = fileName.replace(/\.[^.]+$/, mime.extension);
        }
        blob.name = fileName;
        return blob;
    } else {
        throw new Error('invalid image string')
    }
}

export function getMiddleColor(c1, c2) {
    return ((parseInt(c1, 16) - parseInt(c2, 16)) / 2 + parseInt(c2, 16)).toString(16)
}

/**
 * https://stackoverflow.com/questions/1125084/how-to-make-the-window-full-screen-with-javascript-stretching-all-over-the-scre
 * https://stackoverflow.com/questions/36672561/how-to-exit-fullscreen-onclick-using-javascript
 */
export function ToggleFullScreen(target = document.documentElement, status) {
    const isInFullScreen = IsInFullScreen();
    if (!isInFullScreen) {
        if(status === false) {
            return Promise.resolve(true)
        }
        const enter = target.requestFullscreen || target.mozRequestFullScreen || target.webkitRequestFullScreen || target.msRequestFullscreen
        if(enter) {
            return enter.call(target)
        }
    } else {
        if(status === true) {
            return Promise.resolve(true)
        }
        const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen
        if(exit) {
            return exit.call(document)
        }
    }
    if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        const wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            return wscript.SendKeys("{F11}");
        }
    }
    throw new Error("This browser doesn't support full screen script.")
}

export function IsInFullScreen() {
    return (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null)
}

export const DownloadByUrl = throttle(function (url, fileName) {
    const link = document.createElement('a');
    link.href = url;
    if(fileName) {
        link.download = fileName // doesn't work for cross-origin requests
    }
    link.click();
    return timer(1000) // delay 1s for next download (if not, all previous download tasks will be canceled in chrome)
}, 1)

export function DownloadByBlob(blob, fileName) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
    } else {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        if(fileName) {
            link.download = fileName // doesn't work for cross-origin requests, works for blob download
        }
        link.click();
        window.URL.revokeObjectURL(link.href);
    }
}

export function GetFileExtension(fileName, lower = true) {
    const extension = /\.([a-zA-Z0-9]+)$/.test(fileName) ? RegExp.$1 : ''
    return extension.toLowerCase()
}

export const PART_SELECTION = Symbol('part-selection')
