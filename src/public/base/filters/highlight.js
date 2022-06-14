import {PlatformService} from "../../platform/platform.service";
import {EscapeRegexCharacter} from "../utils";

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
        words = words.filter(c => c)
        if (!words.length) {
            return value;
        }
        words.sort((l, r) => {
            if (l.length < r.length) return 1;
            if (l.length > r.length) return -1;
            return 0
        })
        const matchStr = words.map(c => {
            const temp = EscapeRegexCharacter(c);
            if (/^&?#?\d*;?$/.test(c)) {
                let re_word = temp + '(?!#?\\d*;)';
                if(!PlatformService.instance.isSafari) {
                    re_word = '(?<!&#?\\d*)' + re_word
                }
                return re_word
            }
            return temp;
        }).join('|');
        if (!matchStr) {
            return value;
        }
        const template = IsValidColor(colorOrTemplate) ?
            `<em style="color:${colorOrTemplate};font-style: inherit;">$&</em>` :
            colorOrTemplate
        let re_str = matchStr + '(?![^<>]*>)'
        if(!PlatformService.instance.isSafari) {
            re_str = '(?<!<[^<>]*)' + re_str
        }
        const re = new RegExp(re_str, 'gi');
        return value.replace(re, template);
    })
}
