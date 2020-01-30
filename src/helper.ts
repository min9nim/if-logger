import chalk from 'chalk'
import {ILoggerOption} from './types'

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
}

export function consoleTransport(level: string, message: string, colorMessage: string[]) {
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

const NODE_COLOR = {
  red: '\x1b[31m%s\x1b[0m',
  yellow: '\x1b[33m%s\x1b[0m',
  white: '%s',
  green: '\x1b[32m%s\x1b[0m',
  gray: '\x1b[90m%s\x1b[0m',
  cyan: '\x1b[36m%s\x1b[0m',
}
