let singleton = null

export class AppService {
    static get instance() {
        if (!singleton) {
            singleton = new AppService()
            singleton.aaa = 'singleton'
        }
        return singleton
    }

    test = null
    aaa = 'init'

    constructor() {
    }
}


