import {Stopwatch, TimeManager} from './helper'

export interface IPrintLog {
  (...args: any[]): void
  time: (label: string) => void
  timeEnd: (label: string) => void
  stopwatch: Stopwatch
}

export interface ILogger {
  error: IPrintLog
  warn: IPrintLog
  log: IPrintLog
  info: IPrintLog
  verbose: IPrintLog
  debug: IPrintLog
  options: ILoggerOption
  timeMgr: TimeManager
  isGo: (level: string) => boolean
  if: (pred: (() => boolean) | boolean) => ILogger
  tags: (tags: any[]) => ILogger
  addTags: (tags: any[]) => ILogger
  new: (options: ILoggerOption) => ILogger
}

export interface ILoggerRequired extends ILogger {
  options: ILoggerOptionRequired
}

export interface ILoggerOption {
  level?: FnOrStr
  levelFilter?: string[]
  tags?: FnOrStr[]
  tagFilter?: string[]
  format?: (level: string, tags: FnOrStr[], message: string) => string
  pred?: (() => boolean) | boolean
  transports?: ((level: string, message: string, formatMessage: string) => any)[]
  returnValue?: boolean
}

export type FnOrStr = (() => string) | string

export interface ILoggerOptionRequired extends ILoggerOption {
  level: string
  levelFilter: string[]
  tags: FnOrStr[]
  tagFilter: string[]
  format: (level: string, tags: FnOrStr[], message: string) => string
  pred: (() => boolean) | boolean
  transports: ((level: string, message: string, formatMessage: string) => any)[]
  returnValue: boolean
}
