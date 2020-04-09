import {ILoggerRequired} from './types'
import {isNode, getHeaderString, getColorMessage, getNodeColorMessage, useFormat} from './utils'
import {LOG_LEVEL} from './setting'

export function buildPrintLog(level: string, prop: string) {
  return function printLog(this: ILoggerRequired, ...args: any[]) {
    if (!this) {
      throw Error(
        '`this` is undefined. Do you ever pass `logger.XXXX` as a parameter? Then the `this` binding is required'
      )
    }
    if (!isGo(this.options, level)) {
      return
    }
    if (typeof args[0] === 'function') {
      const result = args[0](
        useFormat(level, this.options.tags, this.options.format),
        level,
        this.options.tags,
        getHeaderString([level, ...this.options.tags])
      )
      return this.options.returnValue ? result : undefined
    }
    if (args.length > 1 || typeof args[0] === 'object') {
      const result = multiArgsHandler(this.options.format, level, this.options.tags, args)
      return this.options.returnValue ? result : undefined
    }

    let message = this.options.format(level, this.options.tags, args[0])
    const timeLabel = '[' + level + '] ' + args[0]
    if (prop === 'time') {
      this.timeMgr.time(timeLabel)
      return
    }
    let time
    if (prop === 'timeEnd') {
      time = this.timeMgr.timeEnd(timeLabel)
      if (time === undefined) {
        return
      }
      message = message + ' ' + time + 'ms'
    }

    const result = this.options.transports.map(transport =>
      transport(level, args[0], message, time, this.options.timeEndLimit)
    )
    return this.options.returnValue ? result : undefined
  }
}

export function isGo(options, level: string) {
  const optionLevel = typeof options.level === 'function' ? options.level() : options.level
  if (LOG_LEVEL[optionLevel].priority < LOG_LEVEL[level].priority) {
    return false
  }
  if (options.levelFilter.length > 0 && !options.levelFilter.includes(level)) {
    return false
  }
  if (options.tagFilter.length > 0 && !options.tagFilter.some(tag => options.tags.includes(tag))) {
    return false
  }
  if (options.pred !== undefined) {
    if (typeof options.pred === 'function') {
      return options.pred()
    }
    return options.pred
  }
  return true
}

export function multiArgsHandler(format: any, level: string, tags: any[] = [], args: any[]) {
  const header = format(level, tags, '').trim()

  const result = isNode()
    ? [header, ...args].map(param => getNodeColorMessage(level, param))
    : [...getColorMessage(level, header), ...args] // In browser, It can be applied `formatting` to only the first argument
  console[console[level] ? level : 'log'](...result)
  return result
}
