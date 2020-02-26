export const NODE_COLOR = {
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
