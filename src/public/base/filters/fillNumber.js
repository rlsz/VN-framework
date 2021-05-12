function fixIntegerLength(intStr, len, leftFill = true) {
    if (len <= intStr.length) {
        return intStr
    } else {
        let fillStr = new Array(len).fill(0).join('')
        if (leftFill) {
            fillStr += intStr
            return fillStr.substring(intStr.length)
        } else {
            fillStr = intStr + fillStr
            return fillStr.substring(0, len)
        }
    }
}

export default function (Vue) {
    /**
     * format: 'left.right'
     * left: left min length, filling 0 if too short
     * right: right min length, filling 0 if too short
     */
    Vue.filter('fillNumber', function (value, format = '0.0') {
        let str = value + ''
        if (/^(-?)(\d+)(\.?)(\d*)$/g.test(str)) {
            let num = [RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$4]
            let [left, right] = format.split('.')
            left = left && Number(left)
            right = right && Number(right)
            if (left && num[1]) {
                num[1] = fixIntegerLength(num[1], left)
            }
            if (right && num[3]) {
                num[3] = fixIntegerLength(num[3], right, false)
            }
            return num.join('')
        } else {
            return value
        }
    })
}
