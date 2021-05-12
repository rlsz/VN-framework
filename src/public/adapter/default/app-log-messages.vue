<template>
  <div class="app-log-messages" :class="position">
    <div v-for="(log) in logs"
         :key="log.id"
         class="message"
         :class="{[log.instance.level.replace('[', '').replace(']', '')]: true, 'animate-down': log.slidedown}"
         v-on:animationend="onAnimationEnd(log, $event)"
    >
      <div :class="{'slide-in': log.slidein, disappear: log.fadeout}">
        <span>{{log.instance.summary}}</span>
      </div>
    </div>
  </div>
</template>

<script>

import {GeneratorFactory, throttle} from "../../base/utils";
import {Level,OutputMethod} from "../../logger/logger";
import {LoggerService} from "../../logger/logger.service";
import {DialogService} from "../../dialogs/dialog.service";
import AppLogMessageDialog from './app-log-message-dialog'
import {Model} from "../../dialogs/dialog";
import {PlatformService} from "../../platform/platform.service";
import {Platform} from "../../platform/platform";

const NewID = GeneratorFactory('log_id_')
export default {
  data() {
    return {
      logs: []
    }
  },
  computed: {
    position(){
      return PlatformService.instance.platform === Platform.pc ? 'right' : 'bottom';
    }
  },
  created() {
    const showLog = throttle(log => this.logStart(log), 3, log => log.summary)

    const titleMap = {
      [Level.debug]: '调试信息',
      [Level.info]: '提示',
      [Level.warning]: '警告',
      [Level.success]: '成功',
      [Level.error]: '错误',
    }

    LoggerService.instance.latestLog().subscribe(log => {
      if([Level.debug].indexOf(log.level) >= 0) {
        return
      }
      if (log.outputMethod === OutputMethod.dialog) {
        DialogService.instance.open(
            AppLogMessageDialog,
                {
                  data: log,
                  title: titleMap[log.level],
                  disableClose: log.level === Level.error,
                  model: Model.float
                }
        )
      } else {
        showLog(log)
      }
    });
  },
  methods: {
    onAnimationEnd(log, event) {
      switch (event.animationName) {
        case 'log-slide-in-right':
        case 'log-slide-in-bottom':
          log.slidein = false
          log.fadeout = true;
          break;
        case 'log-slide-down-right':
        case 'log-slide-down-bottom':
          log.slidedown = false
          break;
        case 'log-fade-out':
          log.fadeout = false
          this.logEnd(log)
          break;
        default:
          break;
      }
    },
    logStart(log) {
      if(!log.summary) {
        return
      }
      return new Promise(r => {
        const newid = NewID()
        this.logs.forEach(log => {
          if (log.slidedown) {
            log.slidedown = false
            window.requestAnimationFrame(function (time) {
              log.slidedown = true
            });
          } else {
            log.slidedown = true
          }
        })
        this.logs.unshift({
          id: newid,
          slidein: true,
          slidedown: false,
          fadeout: false,
          instance: log,
          resolve: r
        });
      })
    },
    logEnd(log) {
      this.logs.splice(this.logs.indexOf(log), 1)
      log.resolve(true)
    }
  }
}
</script>

<style scoped>

</style>
