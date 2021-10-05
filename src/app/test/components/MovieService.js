import {throttle, ToggleFullScreen} from "@/public/base";

export class MovieService {
    src = null
    resolve
    vm

    get videoRef() {
        return this.vm.$refs.video
    }
    play(file) {
        this.src = URL.createObjectURL(file)
        return new Promise(r => {
            this.resolve = r
        })
    }
    end() {
        this.resolve('ended')
    }

    diCreated(vm) {
        this.vm = vm
    }

    multiPlay(children) {
        ToggleFullScreen(this.videoRef, true).then(() => {
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
        })
    }
}
