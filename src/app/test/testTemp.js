function getJson(keyStr = 'a.b.c.d', value = 1) {
    //
    // {
    //   a: {
    //     b: {
    //       c: {
    //         d: 2;
    //       }
    //     }
    //   }
    // }
    let o = {}
    keyStr.split('.').reduce((target, key, index, arr) => {
        if(index === arr.length -1) {
            target[key] = value
        } else if(!target[key]) {
            target[key] = {}
        }
        return target[key]
    }, o)

    return o
}
