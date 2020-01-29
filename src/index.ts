import {getColorMessage, DEFAULT_OPTIONS, LOG_LEVEL, isGo} from './helper'
import {ILoggerOption, ILogger} from './types'

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
    return label + ' ' + (Date.now() - asisTime) + 'ms'
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
      return createLogger({...this.options, ifResult: typeof pred === 'function' ? pred() : pred})
    },
    tags(tags: string[]) {
      return createLogger({...this.options, tags})
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
  return function printLog(this: ILogger, ...args: any[]) {
    if (!isGo(this.options, level)) {
      return
    }
    if (typeof args[0] === 'function') {
      args[0]()
      return
    }
    const header = [level, ...(this.options.tags || [])]
      .map((str: any) => {
        if (typeof str === 'function') {
          return '[' + str() + ']'
        }
        return '[' + str + ']'
      })
      .join('')
    let message = header + ' ' + args[0]

    if (this.options.format) {
      if (typeof this.options.format !== 'function') {
        console.warn('format option should be a function')
        return
      }
      message = this.options.format(level, this.options.tags || [], args[0])
    } else if (args.length > 1 || typeof args[0] === 'object') {
      console.log(header, ...args)
      return
    }

    if (prop === 'time') {
      timeMgr.time(message)
      return
    }
    if (prop === 'timeEnd') {
      message = timeMgr.timeEnd(message)
    }
    if (!this.options.transports) {
      console.warn('[error] transports is not defined')
      return
    }
    const colorMessage = getColorMessage(level, message)
    const result = this.options.transports.map(transport => transport(level, message, colorMessage))
    return this.options.returnValue ? result : undefined
  }
}
