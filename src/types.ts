import {Stopwatch, TimeManager} from './helper'

export type FnOrStr = (() => string) | string
export type FnOrStrList = FnOrStr[]
export type Tags = FnOrStrList[] | FnOrStr[]

export interface IPrintLog {
  (...args: any[]): void
  time: (label: string) => void
  timeEnd: (label: string) => void
  stopwatch: Stopwatch
}

export interface ILogger {
  version: string
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
  tags: (...args: Tags) => ILogger
  addTags: (...args: Tags) => ILogger
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
  transports?: ((
    level: string,
    message: string,
    formatMessage: string,
    time?: number,
    timeEndLimit?: number
  ) => any)[]
  returnValue?: boolean
  timeEndLimit?: number
}

export interface ILoggerOptionRequired extends ILoggerOption {
  level: string
  levelFilter: string[]
  tags: FnOrStr[]
  tagFilter: string[]
  format: (level: string, tags: FnOrStr[], message: string) => string
  pred: (() => boolean) | boolean
  transports: ((
    level: string,
    message: string,
    formatMessage: string,
    time?: number,
    timeEndLimit?: number
  ) => any)[]
  returnValue: boolean
}
