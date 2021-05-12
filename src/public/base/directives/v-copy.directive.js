import {LoggerService} from '../../logger'
import {Directive, DirectiveContext} from "./directive-base";

class OldCopy {
    textArea = null
    text = ''
    constructor(text) {
        this.text = text
    }
    isIOS() {
        //can use a better detection logic here
        return navigator.userAgent.match(/ipad|iphone/i)
    }
    createTextArea(text) {
        this.textArea = document.createElement('textArea')
        this.textArea.contentEditable = true
        this.textArea.value = text
        this.textArea.readOnly = true
        document.body.appendChild(this.textArea)
    }
    selectText() {
        this.textArea.focus()
        if (this.isIOS()) {
            let range = document.createRange()
            range.selectNodeContents(this.textArea)
            let selection = window.getSelection()
            selection.removeAllRanges()
            selection.addRange(range)
            this.textArea.setSelectionRange(0, 999999)
        }else {
            this.textArea.select()
        }
    }
    copyTo() {
        document.execCommand('copy')
        document.body.removeChild(this.textArea)
    }

    execute(){
        try {
            this.createTextArea(this.text)
            this.selectText()
            this.copyTo()
            LoggerService.instance.success('复制成功')
        } catch (e) {
            LoggerService.instance.error('复制失败')
        }
    }

}

class VCopyDirective extends DirectiveContext {
    el
    bind(el) {
        super.bind(...arguments);
        this.el = el
        this.el.style.cursor = 'copy'
    }
    onClick() {
        this.copyToClipboard(this.value || this.el.innerText)
    }

    copyToClipboard(textToCopy) {
        if (navigator.permissions && navigator.clipboard) {
            navigator.permissions.query({name: 'clipboard-write'}).then(result => {
                if (result.state == 'granted' || result.state == 'prompt') {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        LoggerService.instance.success('复制成功')
                    }).catch(() => {
                        LoggerService.instance.error('复制失败')
                    })
                } else {
                    // LoggerService.instance.error('复制失败，没有权限')
                    new OldCopy(textToCopy).execute()
                }
            })
        } else {
            new OldCopy(textToCopy).execute()
        }
    }
}

export default function() {
    new Directive('copy').register(VCopyDirective)
}
