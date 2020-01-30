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
  tags: (tags: any[]) => ILogger
  addTags: (tags: any[]) => ILogger
  new: (options: ILoggerOption) => ILogger
}

export interface ILoggerRequired extends ILogger {
  options: ILoggerOptionRequired
}

export interface ILoggerOption {
  level?: string
  levelFilter?: string[]
  tags?: Tag[]
  tagFilter?: string[]
  format?: (level: string, tags: Tag[], message: string) => string
  transports?: ((level: string, message: string) => any)[]
  returnValue?: boolean
}

export type Tag = (() => string) | string

export interface ILoggerOptionRequired extends ILoggerOption {
  level: string
  levelFilter: string[]
  tags: Tag[]
  tagFilter: string[]
  format: (level: string, tags: Tag[], message: string) => string
  transports: ((level: string, message: string) => any)[]
  returnValue: boolean
}
