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
}

export function consoleTransport(level: string, message: string, colorMessage: string[]) {
  if (!console[level]) {
    console.log(...colorMessage)
    return
  }
  console[level](...colorMessage)
  return
}

export function getColorMessage(level: string, message: string): string[] {
  if (isNode()) {
    const str = chalk[LOG_LEVEL[level].color](message)
    return [str.slice(0, 5) + '%s' + str.slice(-4), str.slice(5, -4)]
  }
  return ['%c' + message, 'color: ' + LOG_LEVEL[level].color]
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
