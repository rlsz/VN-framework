import {Level, levelColor, Log, Source} from './logger';
import {FormatDate, GeneratorFactory, SimpleSubject} from '../base/utils';
import {TIME_ALERT} from './tokens';
import {initUIMessage} from '../adapter'

let singleton = null

/**
 * Uncaught promise: https://stackoverflow.com/questions/53505159/prevent-of-uncaught-in-promise-warning-how-to-avoid-of-catch-block-es6-p
 */
export class LoggerService {
    static get instance() {
        if (!singleton) {
            singleton = new LoggerService()
        }
        return singleton
    }
    log = new SimpleSubject();
    caches = {};

    constructor() {
        this.initUIMessage()
        if (process.env.VUE_APP_DEBUG === 'false') {
            this.initGlobalLog();
        } else {
            this.initDebugLog();
        }
    }

    initDebugLog() {
        this.latestLog().subscribe(log => {
            if (log.level === Level.debug) {
                console.log.apply(console, [
                    `${FormatDate(log.time)} %c${log.level}${log.source}${log.outputMethod}`,
                    `color: ${levelColor[log.level]};`,
                    ...log.details
                ]);
            } else {
                console.log.apply(console, [
                    `${FormatDate(log.time)} %c${log.level}${log.source}${log.outputMethod} ${log.summary}`,
                    `color: ${levelColor[log.level]};`
                ]);
            }
        });

        // window.addEventListener('unhandledrejection', event => {
        //     event.preventDefault();
        //     this.error(event.reason)
        // });
    }

    initGlobalLog() {
        window.onerror = (messageOrEvent, source, lineno, colno, error) => {
            this.error(Source.application, messageOrEvent, source, lineno, colno, error);
            return true;
        };

        window.addEventListener('unhandledrejection', event => {
            event.preventDefault();
        });
    }

    initUIMessage() {
        initUIMessage(this.latestLog())
    }

    latestLog() {
        return this.log;
    }

    insertNewLog(log) {
        if (process.env.VUE_APP_DEBUG === 'false') {
            if (log.level === Level.debug) {
                return log;
            }
        }
        this.log.next(log);
        return log
    }

    debug(...args) {
        return this.insertNewLog(new Log(Level.debug, ...args));
    }

    info(...args) {
        return this.insertNewLog(new Log(Level.info, ...args));
    }

    warning(...args) {
        return this.insertNewLog(new Log(Level.warning, ...args));
    }

    success(...args) {
        return this.insertNewLog(new Log(Level.success, ...args));
    }

    error(...args) {
        return this.insertNewLog(new Log(Level.error, ...args));
    }

    errorThrow(...args) {
        const log = new Log(Level.error, ...args);
        this.insertNewLog(log);
        throw new Error(log.summary);
    }

    // e.g. time(p1,p2,p3)
    time(...args) {
        const id = newTimeID();
        if (this.caches[id + '']) {
            this.warning(`duplicate ${id}`);
        } else {
            this.caches[id + ''] = {
                start: (new Date()).getTime(),
                args
            };
        }
        const self = this;
        return {
            // e.g. end('some text {0} {1} {2} {t}') will format as 'some text p1 p2 p3 12.45987s'
            end(msgTemplate, ...args1) {
                self.timeEnd(id, msgTemplate, ...args1);
            }
        };
    }

    // e.g. timeEnd(12,'some text {0} {1} {2} {t}') will format as 'some text p1 p2 p3 12.45987s'
    timeEnd(id, msgTemplate, ...args) {
        const cache = this.caches[id + ''];
        if (!cache) {
            this.warning(`no timer for id ${id}`);
            return;
        }
        delete this.caches[id + ''];
        const timespan = ((new Date()).getTime() - cache.start) / 1000;
        if (typeof msgTemplate === 'function') {
            msgTemplate = msgTemplate.apply(null, cache.args);
        }
        let msg = cache.args.reduce((res, item, index) => {
            return res.replace(new RegExp('{(' + index + ')}', 'g'), item);
        }, msgTemplate);
        msg = msg.replace(/{t}/g, timespan + 's');
        this.insertNewLog(new Log(
            timespan > TIME_ALERT ? Level.warning : Level.debug,
            msg,
            ...args
        ));
    }
}

const newTimeID = GeneratorFactory('time_id_')


