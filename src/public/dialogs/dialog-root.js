/**
 * vue时序问题：
 * 假设四个组件：View1、View1Child、View2、View2Child
 * 从View1跳转到View2，测试得到的生命周期顺序如下：
 * View1-beforeCreate、View1-created、View1-beforeMount
 * View1Child-beforeCreate、View1Child-created、View1Child-beforeMount、View1Child-Mounted
 * View1-Mounted、View1-nextTick
 * View1Child-nextTick
 *
 * View2-beforeCreate、View2-created、View2-beforeMount
 * View2Child-beforeCreate、View2Child-created、View2Child-beforeMount
 * View1-beforeDestroy
 * View1Child-beforeDestroy、View1Child-destroyed
 * View1-destroyed
 * View2Child-Mounted
 * View2-Mounted、View2-nextTick
 * View2Child-nextTick
 *
 * 使用 (created-nextTick) + (destroyed) 可以得到正常时序：
 * View1-nextTick
 * View1Child-nextTick
 * View1Child-destroyed
 * View1-destroyed
 * View2-nextTick
 * View2Child-nextTick
 *
 * 但是这种控制时序的方法有点trick，暂时使用另外一种时序控制方法：
 * created -- push(vm)
 * destroyed -- pop(vm)
 * 虽然时序不对，但是通过传入vm可以在一定程度上正常使用stack，后期如果发现有问题再调整时序吧
 *
 * @type {{pop(*=): *, stack: *[], readonly current: *, push(*=): void}}
 */
export let dialogParent = {
    stack: [],
    push(vm) {
        this.stack.push(vm)
    },
    pop(vm) {
        return this.stack.splice(this.stack.indexOf(vm), 1)
        // return this.stack.pop() // due to vue lifecycle problem, can't pop in destroyed
    },
    get current() {
        return this.stack[this.stack.length - 1]
    }
}

export class DialogRoot {
    diCreated(vm) {
        dialogParent.push(vm)
    }
    diDestroyed(vm) {
        dialogParent.pop(vm)
    }
}

window.getDialogRoot = () => {
    return dialogParent
}
