import {consoleTransport, buildPrintLog} from './helper'
import Stopwatch from './StopWatch'
import TimeManager from './TimeManager'
import {ILoggerOption, ILogger, Tags} from './types'
import {trim, defaultFormat} from './utils'
import packageJson from '../package.json'
import {LOG_LEVEL} from './setting'

export * from './helper'
export * from './types'
export * from './setting'
export * from './utils'

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

export default function createLogger(options: ILoggerOption = DEFAULT_OPTIONS): ILogger {
  const logger: any = {
    version: packageJson.version,
    options: {
      ...DEFAULT_OPTIONS,
      ifResult: true,
      ...trim(options),
    },
    timeMgr: new TimeManager(),
    if(pred) {
      return createLogger({...this.options, pred})
    },
    tags(...args: Tags) {
      const tags = Array.isArray(args[0]) ? args[0] : args
      return createLogger({...this.options, tags})
    },
    addTags(...args: Tags) {
      const tags = Array.isArray(args[0]) ? args[0] : args
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
    logger[level].stopwatch = new Stopwatch(buildPrintLog(level, level).bind(logger))
  })
  return logger
}
