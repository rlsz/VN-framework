export const PercentageType = {
    noPlusSymbol: 1,
    noPowerPercent: 2
}
export default function (Vue) {
    Vue.filter('percentage', function (value, types = []) {
        if (typeof value === 'string') {
            const temp = Number(value)
            if (isNaN(temp)) {
                return value || '-'
            } else {
                value = temp
            }
        }
        if (typeof value !== 'number') {
            return value || '-'
        }
        if (types.indexOf(PercentageType.noPowerPercent) < 0) {
            value = value * 100
        }
        let symbol = ''
        if (value > 0 && types.indexOf(PercentageType.noPlusSymbol) < 0) {
            symbol = '+'
        }
        return symbol + value.toFixed(2) + '%'
    })
}
