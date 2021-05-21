export function menuAdapter(menus, path = '') {
    if(!menus || !menus.length) {
        return []
    }
    return menus.reduce((arr, c) => {
        let p = path + c.path
        if(c.path.startsWith('/')) {
            p = c.path
        }
        const meta = c.meta
        const p1 = (p + '/').replace(/\/{2,}$/, '/')
        if(meta) {
            arr.push({
                path: p,
                ...meta,
                children: menuAdapter(c.children, p1)
            })
        } else {
            arr.push(...menuAdapter(c.children, p1))
        }

        return arr
    }, [])
}
