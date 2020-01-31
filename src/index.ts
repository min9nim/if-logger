import {DEFAULT_OPTIONS, LOG_LEVEL, isGo, multiArgsHandler, consoleTransport} from './helper'
import {ILoggerOption, ILogger, ILoggerRequired} from './types'

export * from './helper'

class TimeManager {
  timeLabels = {}
  time(label: string) {
    if (this.timeLabels[label]) {
      console.warn(`[error] duplicate label [${label}]`)
      return
    }
    this.timeLabels[label] = Date.now()
  }
  timeEnd(label: string) {
    const asisTime = this.timeLabels[label]
    if (!asisTime) {
      console.warn(`[error] Not found label [${label}]`)
      return ''
    }
    this.timeLabels[label] = undefined
    return Date.now() - asisTime
  }
}

const timeMgr = new TimeManager()

export function createLogger(options: ILoggerOption = DEFAULT_OPTIONS): ILogger {
  const logger: any = {
    options: {
      ...DEFAULT_OPTIONS,
      ifResult: true,
      ...options,
    },
    if(pred) {
      return createLogger({...this.options, pred})
    },
    tags(tags: string[]) {
      return createLogger({...this.options, tags})
    },
    addTags(tags: string[]) {
      return createLogger({...this.options, tags: [...this.options.tags, ...tags]})
    },
    new(options: ILoggerOption) {
      return createLogger({...this.options, ...options})
    },
  }
  Object.keys(LOG_LEVEL).forEach(level => {
    if (['off', 'all'].includes(level)) {
      return
    }
    logger[level] = buildPrintLog(level, level)
    logger[level].time = buildPrintLog(level, 'time').bind(logger)
    logger[level].timeEnd = buildPrintLog(level, 'timeEnd').bind(logger)
  })
  return logger
}

function buildPrintLog(level: string, prop: string) {
  return function printLog(this: ILoggerRequired, ...args: any[]) {
    if (!isGo(this.options, level)) {
      return
    }
    if (typeof args[0] === 'function') {
      const result = args[0]()
      return this.options.returnValue ? result : undefined
    }
    if (args.length > 1 || typeof args[0] === 'object') {
      const result = multiArgsHandler(level, this.options.tags, args)
      return this.options.returnValue ? result : undefined
    }

    let message = this.options.format(level, this.options.tags, args[0])
    const timeLabel = '[' + level + '] ' + args[0]
    if (prop === 'time') {
      timeMgr.time(timeLabel)
      return
    }
    if (prop === 'timeEnd') {
      message = message + ' ' + timeMgr.timeEnd(timeLabel) + 'ms'
    }

    const result = this.options.transports.map(transport => transport(level, args[0], message))
    return this.options.returnValue ? result : undefined
  }
}
