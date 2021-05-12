import {GeneratorFactory, SimpleSubject} from "../base/utils";

export const Model = {
    float: 'float',
    fillAvailable: 'fill-available',
    transparent: 'transparent'
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

    constructor(config) {
        this.id = NewID()
        this.config = config
        this._state = new SimpleSubject()
        this._state.next(State.init)
    }

    close(dialogResult) {
        const tempClose = () => {
            this._result = dialogResult
            this._state.next(State.closed)
            this._state.complete()
        }
        if(this.config && this.config['before-close']) {
            this.config['before-close'](tempClose, dialogResult)
        } else {
            tempClose()
        }
    }

    setOpen() {
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
//     disableClose?: boolean; // Whether the user can use escape or clicking on the backdrop to close the modal.
//     model?: Model;
//     hideHead?: false;
// }
