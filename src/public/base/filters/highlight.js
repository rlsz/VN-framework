import {SimpleClone} from "../utils";

const escapeRe = /[-/\\^$*+?.()|[\]{}]/g;

function EscapeRegexCharacter(s) {
    return s.replace(escapeRe, '\\$&');
}

function IsValidColor(strColor) {
    if (!strColor) {
        return true
    }
    const s = new Option().style;
    s.color = strColor;
    return s.color !== '';
}

export default function (Vue) {
    Vue.filter('highlight', function (value, words, colorOrTemplate = '#E94848') {
        if (typeof value !== 'string') {
            return value
        }
        if (!words) {
            return value;
        }
        if (!words.length) {
            return value;
        }
        words = words.filter(c => c)
        words.sort((l, r) => {
            if (l.length < r.length) return 1;
            if (l.length > r.length) return -1;
            return 0
        })
        const matchStr = words.map(c => {
            const temp = EscapeRegexCharacter(c);
            if (/^&?#?\d*;?$/g.test(c)) {
                return '(?<!&#?\\d*)' + temp + '(?!#?\\d*;)';
            }
            return temp;
        }).join('|');
        if (!matchStr) {
            return value;
        }
        const template = IsValidColor(colorOrTemplate) ?
            `<em style="color:${colorOrTemplate};font-style: inherit;">$&</em>` :
            colorOrTemplate
        const re = new RegExp(matchStr, 'gi');
        return value.replace(re, template);
    })
}
