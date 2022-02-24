import {GeneratorFactory, SimpleSubject} from "../base/utils";

export const Model = {
    float: 'float',
    fillAvailable: 'fill-available',
    transparent: 'transparent',
    positionByAnchor: 'position-by-anchor',
    fixed: 'fixed'
}

export const Position = {
    auto: 'auto',
    left: 'left',
    top: 'top',
    bottom: 'bottom',
    right: 'right',
    bottomStrict: 'bottomStrict'
}

export const State = {
    init: 1,
    opened: 2,
    closed: 3
}

const NewID = GeneratorFactory('dialog_id_')

export class Dialog {
    id;
    _state;
    _result;
    config;
    _vm;

    constructor(config) {
        this.id = NewID()
        this.config = config
        this._state = new SimpleSubject()
        this._state.next(State.init)
    }

    close(dialogResult) {
        return new Promise((r,j) => {
            try {
                const tempClose = newResult => {
                    try {
                        this._result = newResult === undefined ? dialogResult : newResult
                        this._state.next(State.closed)
                        this._state.complete()
                        r()
                    } catch (err1) {
                        j(err1)
                    }
                }
                const beforeClose = this.config && (this.config['before-close'] || this.config['beforeClose'])
                if(beforeClose) {
                    beforeClose.call(this.config, tempClose, dialogResult)
                } else {
                    tempClose()
                }
            } catch (err) {
                j(err)
            }
        })
    }

    error(msg) {
        this._state.error(msg)
    }

    setOpen(vm) {
        this._vm = vm
        this._state.next(State.opened)
    }

    afterOpened() {
        return new Promise((r, j) => {
            try {
                const sub = this._state.subscribe(c => {
                    if(c === State.opened) {
                        sub.unsubscribe()
                        r(undefined)
                    }
                }, err => {
                    j(err)
                })
            } catch (e) {
                j(e)
            }
        })
    }

    afterClosed() {
        return new Promise((r, j) => {
            try {
                const sub = this._state.subscribe(c => {
                    if(c === State.closed) {
                        sub.unsubscribe()
                        r(this._result)
                    }
                }, err => {
                    j(err)
                })
            } catch (e) {
                j(e)
            }
        })
    }
}

// export interface DialogItem<T = any, D = any, R = any> {
//     instance: Dialog<T, R>;
//     vueComponent?: ComponentType<T>;
//     message?: string;
//     config?: DialogConfig<D, T>;
// }
// export interface DialogConfig<D = any, T = any> {
//     data?: D | null;
//     title?: string; // dialog title
//     tip?: string; // dialog title tip
//     buttons?: Button<T>[];
//     beforeClose: (done, data) => void;
//     'before-close': (done, data) => void;
//     disableClose?: boolean; // Whether the user can use escape or clicking on the backdrop to close the modal, same to 'close-on-click-overlay'
//     model?: Model;
//     hideHead?: false;
//     backgroundCover: null; // null - auto cover: anchor position - no cover, others - cover; true - cover always; false - no cover always
// }
