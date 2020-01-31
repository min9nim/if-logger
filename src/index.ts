import {DEFAULT_OPTIONS, LOG_LEVEL, buildPrintLog, Stopwatch} from './helper'
import {ILoggerOption, ILogger} from './types'

export * from './helper'

export default function createLogger(options: ILoggerOption = DEFAULT_OPTIONS): ILogger {
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
    logger[level].stopwatch = new Stopwatch(buildPrintLog(level, level).bind(logger))
  })
  return logger
}
