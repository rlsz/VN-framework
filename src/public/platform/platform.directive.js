export default function (platform) {
    return {
        bind: function (el, binding, vnode) {
            el.classList.add(platform)
        }
    }
}
