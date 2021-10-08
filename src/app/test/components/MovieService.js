import {throttle, timer, ToggleFullScreen} from "@/public/base";
import {LoggerService} from "@/public/logger";

export class MovieService {
    src = null
    resolve
    vm
    injector

    get ls() {
        return this.injector.get(LoggerService)
    }

    constructor(injector) {
        this.injector = injector
    }

    get videoRef() {
        return this.vm.$refs.video
    }
    play(file) {
        this.src = URL.createObjectURL(file)
        return ToggleFullScreen(this.videoRef, true).then(() => {
            return new Promise(r => {
                this.resolve = r
            })
        })
    }
    end() {
        this.ls.info('video end...')
        timer(2000).then(() => this.resolve('ended'))
    }

    diCreated(vm) {
        this.vm = vm
    }

    multiPlay(children) {
        const playOne = throttle(comp => {
            console.log('playing:', comp.value.name)
            return comp.play().then(res => {
                if(res !== 'ended') {
                    throw new Error('video autoplay canceled')
                }
            })
        }, 1)
        const videos = Array.from(children)
            .map(c => c.__vue__)
            .filter(c => c.isVideo)
        videos.forEach(c => playOne(c))
    }
}
