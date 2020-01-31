import {ILoggerOption} from './types'

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
}

export function consoleTransport(level: string, message: string) {
  const colorMessage = getColorMessage(level, message)
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

export function isNode() {
  return typeof process !== 'undefined' && process.versions && process.versions.node
}

export function isGo(options, level: string) {
  if (options.pred !== undefined) {
    if (typeof options.pred === 'function') {
      return options.pred()
    }
    return options.pred
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
