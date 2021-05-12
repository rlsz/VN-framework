export function transform(num) {
    if (typeof num === 'string') {
        const temp = Number(num)
        if (isNaN(temp)) {
            return {result: num, unit: ''};
        } else {
            num = temp
        }
    }
    if (typeof num !== 'number') {
        return {result: '-', unit: ''};
    }
    if (num < Math.pow(10, 4) && num > -Math.pow(10, 4)) {
        return {result: num + '', unit: ''};
    }
    if (num < Math.pow(10, 8) && num > -Math.pow(10, 8)) {
        return {result: (num / Math.pow(10, 4)).toFixed(2), unit: '万'};
    }
    if (num < Math.pow(10, 12) && num > -Math.pow(10, 12)) {
        return {result: (num / Math.pow(10, 8)).toFixed(2), unit: '亿'};
    }
    if (num < Math.pow(10, 16) && num > -Math.pow(10, 16)) {
        return {result: (num / Math.pow(10, 12)).toFixed(2), unit: '兆'};
    }
    // return {result: num.toLocaleString(), unit: ''};
    return {result: num > 0 ? ' > 9999': ' < -9999', unit: '兆'};
}

export default function (Vue) {
    Vue.filter('number', function (value) {
        const {result, unit} = transform(value);
        return result + unit;
    })
}
