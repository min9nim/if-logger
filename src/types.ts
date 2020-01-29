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

export interface ILoggerOption {
  level?: string
  levelFilter?: string[]
  tags?: string[]
  tagFilter?: string[]
  format?: (level: string, tags: string[], message: string) => string
  transports?: ((level: string, message: string, colorMessage: string[]) => any)[]
  returnValue?: boolean
}
