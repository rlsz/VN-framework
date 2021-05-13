import {ERROR_MAP} from './error-messages';

export const Source = {
  unknown: '[-]',
  backend: '[backend]',
  frontend: '[frontend]',
  application: '[application]'
}

export const Level = {
  debug: '[debug]',
  info: '[info]',
  warning: '[warning]',
  success: '[success]',
  error: '[error]'
}

export const OutputMethod = {
  normal: '[normal]',
  dialog: '[dialog]'
}

export const levelColor = {
  [Level.debug]: 'black',
  [Level.info]: '#909399',
  [Level.warning]: '#E6A23C',
  [Level.success]: '#67C23A',
  [Level.error]: '#F56C6C',
};

export class Log {
  level; // Level 日志级别
  summary; // 日志摘要
  details; // 详细日志
  source; // Source 日志来源
  time; // Date 日志写入时间
  outputMethod; // OutputMethod, the method of how to show log

  constructor(...args) {
    this.level = this.extractLevel(args);
    this.source = this.extractSource(args);
    this.outputMethod = this.extractOutputMethod(args);
    this.details = args;
    this.summary = this.getSummary(args);
    this.time = new Date();
  }

  escape(str) {
    if (!str || typeof str !== 'string') {
      return str;
    }
    str = str.replace(/https?:\/\/[^\s]+/g, '*');
    str = str.replace(/[/\\][a-zA-Z0-9]+[/\\][^\s]*/g, '*');
    return ERROR_MAP[str] || str;
  }

  getSummary(message) {
    return message.map(c => {
      if (c === undefined || c === null) {
        return '';
      }
      c = this.generalConvert(c);
      if (typeof c === 'string') {
        return this.escape(c);
      }
      let str;
      try {
        str = JSON.stringify(c, (key, value) => {
          return this.generalConvert(value);
        });
      } catch (e) {
        str = 'serialize-message-error:' + e.message;
      }
      return this.escape(str);
    }).filter(c => c).join(' ');
  }

  generalConvert(c) {
    if (c instanceof Element) {
      return c.outerHTML;
    }
    if (c instanceof Event) {
      if (c.target instanceof WebSocket) {
        return `${c.type}, host: ${c.target.url}, state: ${c.target.readyState}`;
      }
    }

    // if (c instanceof Error || c instanceof AjaxError) {
    //   return c.message;
    // }
    // if (c instanceof HttpErrorResponse) {
    //   let msg = c.error?.message;
    //   if (msg === 'No message available') {
    //     msg = c.error?.error;
    //   }
    //   if (!msg) {
    //     msg = c.message;
    //   }
    //   return msg;
    // }
    if (c instanceof Error) {
      return c.message;
    }

    if (c?.code && c?.message) {
      return c.message;
    }

    if (c?.status && c?.message) {
      return c.message;
    }

    return c;
  }

  extractBase(enumType, args) {
    const index = args.findIndex(c => Object.values(enumType).includes(c));
    let target;
    if (index >= 0) {
      target = args.splice(index, 1)[0]; // notice side effect to args
    }
    return target;
  }

  extractSource(args) {
    return this.extractBase(Source, args) || Source.unknown;
  }

  extractLevel(args) {
    return this.extractBase(Level, args) || null;
  }

  extractOutputMethod(args) {
    return this.extractBase(OutputMethod, args) || OutputMethod.normal;
  }
}

