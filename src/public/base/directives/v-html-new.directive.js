import {Directive, DirectiveContext} from "./directive-base";

/**
 * 微信浏览器、ios系统中，通过v-html绑定的内容可能会出现滚动区域无滚动条的问题
 * 重现问题：需要清除缓存、动态更新v-html内容超出滚动区域、内容被html和body标签包裹，然后通过父级页面跳转该页面，就有概率重现这个问题
 * 主要原因是v-html中更新的内容没有引起浏览器重绘进而导致滚动条出不来
 *
 * 解决方案一：v-html内容更新后延迟一定时间调用base/utils中的ForceRepaint方法重绘页面(也可只重绘v-html所在的节点)
 * 解决方案二：使用v-html-new代替v-html更新innerHTML，并剥离掉外层的html和body
 */
class VHtmlNewDirective extends DirectiveContext {
    bind(el) {
        super.bind(...arguments);
        this.refresh(el)
        el.classList.add('html-new-general')
    }
    update(el) {
        super.bind(...arguments);
        this.refresh(el)
    }

    refresh(el) {
        let value = this.value
        // 过滤html、body标签内容, 需要视情况完善
        if(/<body>([^]*)<\/body>/.test(value)) {
            value = RegExp.$1
        }
        el.innerHTML = value
    }
}

export default function() {
    new Directive('html-new').register(VHtmlNewDirective)
}
