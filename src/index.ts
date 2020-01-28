import chalk from 'chalk'

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
    color: 'blue',
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
}

export interface IPrintLog {
  (...args: any[]): void
  time: (label: string) => void
  timeEnd: (label: string) => void
}

export interface ILogger {
  error: IPrintLog
  warn: IPrintLog
  log: IPrintLog
  info: IPrintLog
  verbose: IPrintLog
  debug: IPrintLog
  options: ILoggerOption
  isGo: (level: string) => boolean
  if: (pred: (() => boolean) | boolean) => ILogger
  tags: (tags: string[]) => ILogger
}

interface ILoggerOption {
  level?: string
  levelFilter?: string[]
  tags?: string[]
  tagFilter?: string[]
  format?: (level: string, tags: string[], message: string) => string
  transports?: ((level: string, message: string, colorMessage: string) => any)[]
}

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
    const header = [level, ...(this.options.tags || [])].map(str => '[' + str + ']').join('')
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
    const colorMessage = getColorMessage(level, message)
    if (['time', 'timeEnd'].includes(prop)) {
      message = time[prop](message)
      if (prop === 'time') {
        return
      }
    }
    if (!this.options.transports) {
      console.warn('transports is not defined')
      return
    }
    return this.options.transports.map(transport => transport(level, message, colorMessage))
  }
}

function isGo(options, level: string) {
  if (!options.ifResult) {
    return false
  }
  if (LOG_LEVEL[options.level].priority < LOG_LEVEL[level].priority) {
    return false
  }
  if (options.levelFilter.length > 0 && !options.levelFilter.includes(level)) {
    return false
  }
  if (options.tagFilter.length > 0 && !options.tagFilter.some(tag => options.tags.includes(tag))) {
    return false
  }
  return true
}

const time = {
  timeLabels: {},
  time(label: string) {
    if (this.timeLabels[label]) {
      console.warn(`duplicate label [${label}]`)
      return
    }
    this.timeLabels[label] = Date.now()
  },
  timeEnd(label: string) {
    const asisTime = this.timeLabels[label]
    if (!asisTime) {
      console.warn(`Not found label [${label}]`)
      return
    }
    this.timeLabels[label] = undefined
    return label + ' ' + (Date.now() - asisTime) + 'ms'
  },
}

export function consoleTransport(level: string, message: string, colorMessage: string | string[]) {
  if (window) {
    if (!console[level]) {
      console.log(...colorMessage)
      return
    }
    console[level](...colorMessage)
    return
  }
  if (!console[level]) {
    console.log(colorMessage)
    return
  }
  console[level](colorMessage)
}

export function getColorMessage(level: string, message: string) {
  return typeof process !== 'undefined' && process.versions && process.versions.node
    ? chalk[LOG_LEVEL[level].color](message)
    : ['%c' + message, 'color: ' + LOG_LEVEL[level].color]
}
