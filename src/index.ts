export const LOG_LEVEL = {
  off: 0,
  error: 1,
  warn: 2,
  log: 3,
  info: 4,
  verbose: 5,
  debug: 6,
  all: 7,
}

export const DEFAULT_LEVEL = 'all'

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
}

export function createLogger(options: ILoggerOption = {}): ILogger {
  const logger: any = {
    options: {
      tagFilter: [],
      levelFilter: [],
      ifResult: true,
      level: DEFAULT_LEVEL,
      tags: [],
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
    const prop = ['error', 'warn', 'info', 'debug'].includes(level) ? level : 'log'
    logger[level] = buildPrintLog(level, prop)
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
    if (['time', 'timeEnd'].includes(prop)) {
      console[prop](header + ' ' + args[0])
      return
    }
    console[prop](header, ...args)
  }
}

function isGo(options, level: string) {
  if (!options.ifResult) {
    return false
  }
  if (LOG_LEVEL[options.level] < LOG_LEVEL[level]) {
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
