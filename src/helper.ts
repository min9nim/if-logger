import {ILoggerOption, ILoggerRequired} from './types'
import {isNode} from './utils'

const NODE_COLOR = {
  red: '\x1b[31m%s\x1b[0m',
  yellow: '\x1b[33m%s\x1b[0m',
  white: '%s',
  green: '\x1b[32m%s\x1b[0m',
  gray: '\x1b[90m%s\x1b[0m',
  cyan: '\x1b[36m%s\x1b[0m',
}

export const LOG_LEVEL = {
  off: {
    priority: 0,
  },
  error: {
    priority: 1,
    color: 'red',
  },
  warn: {
    priority: 2,
    color: 'yellow',
  },
  log: {
    priority: 3,
    color: 'white',
  },
  info: {
    priority: 4,
    color: 'green',
  },
  verbose: {
    priority: 5,
    color: 'gray',
  },
  debug: {
    priority: 6,
    color: 'cyan',
  },
  all: {
    priority: 7,
  },
}

export const DEFAULT_OPTIONS: ILoggerOption = {
  tagFilter: [],
  levelFilter: [],
  level: 'all',
  tags: [],
  transports: [consoleTransport],
  returnValue: false,
  format: defaultFormat,
  timeEndLimit: 1000,
}

export class TimeManager {
  timeLabels = {}
  time(label: string) {
    if (this.timeLabels[label]) {
      // console.warn(`[error] duplicate label [${label}]`)
      consoleTransport('warn', '', `[warn] duplicate label '${label}'`)
      return
    }
    this.timeLabels[label] = Date.now()
  }
  timeEnd(label: string) {
    const asisTime = this.timeLabels[label]
    if (!asisTime) {
      // console.warn(`[error] Not found label [${label}]`)
      consoleTransport('warn', '', `[warn] Not found label '${label}'`)
      return
    }
    this.timeLabels[label] = undefined
    return Date.now() - asisTime
  }
}

export class Stopwatch {
  times: any = []
  header
  printLog
  constructor(printLog) {
    this.printLog = printLog
  }
  start(title?: string) {
    this.header = title ? `[${title}] ` : ''
    this.times = [Date.now()]
    this.printLog(this.header + 'start')
  }
  check(label: string) {
    if (this.times.length === 0) {
      this.printLog('[error] start() has not yet been called')
      return
    }
    this.times.push(Date.now())
    let diff = this.times[this.times.length - 1] - this.times[this.times.length - 2]
    let total = this.times[this.times.length - 1] - this.times[0]
    this.printLog(this.header + label + ` (${diff}ms / ${total}ms)`)
  }
  reset() {
    let total = this.times[this.times.length - 1] - this.times[0]
    this.printLog(this.header + `end (total: ${total}ms)`)
    this.times = []
  }
  end() {
    this.reset()
  }
}

// const timeMgr = new TimeManager() // This should be a singleton object

export function buildPrintLog(level: string, prop: string) {
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
      this.timeMgr.time(timeLabel)
      return
    }
    if (prop === 'timeEnd') {
      const time = this.timeMgr.timeEnd(timeLabel)
      if (time === undefined) {
        return
      }

      const colorMsg = isNode() ? '\x1b[31m' + time + 'ms' + '\x1b[0m' : time + 'ms' // 브라우져는 컬러 바꾸기가 애매해서 스킵;;

      if (!this.options.timeEndLimit) {
        consoleTransport('warn', '', 'this.options.timeEndLimit is undefined')
        return
      }
      message = message + ' ' + (time > this.options.timeEndLimit ? colorMsg : time + 'ms')
    }

    const result = this.options.transports.map(transport => transport(level, args[0], message))
    return this.options.returnValue ? result : undefined
  }
}

export function consoleTransport(level: string, message: string, formatMessage: string) {
  const colorMessage = getColorMessage(level, formatMessage)
  if (!console[level]) {
    console.log(...colorMessage)
    return colorMessage
  }
  console[level](...colorMessage)
  return colorMessage
}

export function getColorMessage(level: string, message: string): string[] {
  const color = LOG_LEVEL[level].color
  if (isNode()) {
    return [NODE_COLOR[color], message]
  }
  return ['%c' + message, 'color:' + color]
}

export function getNodeColorMessage(level: string, message: any): any {
  if (typeof message === 'object') {
    return message
  }
  return NODE_COLOR[LOG_LEVEL[level].color].replace('%s', message)
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

export function getTagString(str: any): string {
  return '[' + (typeof str === 'function' ? str() : str) + ']'
}

export function getHeaderString(strList: string[]): string {
  return strList.map(getTagString).join('')
}

export function defaultFormat(level: string, tags: any[] = [], message: string): string {
  return getHeaderString([level, ...tags]) + ' ' + message
}

export function multiArgsHandler(level: string, tags: any[] = [], args: any[]) {
  const header = getHeaderString([level, ...tags])
  const result = isNode()
    ? [header, ...args].map(param => getNodeColorMessage(level, param))
    : [...getColorMessage(level, header), ...args] // In browser, It can be applied `formatting` to only the first argument
  console.log(...result)
  return result
}
