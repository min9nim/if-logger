import {LOG_LEVEL, NODE_COLOR} from './setting'

export function trim(obj) {
  const result = {}
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined) {
      result[key] = value
    }
  })
  return result
}

export function isNode() {
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    // @ts-ignore
    if (process.versions.electron) {
      return false
    }
    return true
  }
  return false
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

export function getColorMessage(level: string, message: string): string[] {
  const color = LOG_LEVEL[level].color
  if (isNode()) {
    return [NODE_COLOR[color], message]
  }
  return ['%c' + message, 'color:' + color]
}

export function useFormat(level, tags, format) {
  return (...args) => {
    return getColorMessage(level, format(level, tags, args.join(' ')))
  }
}

export function getNodeColorMessage(level: string, message: any): any {
  if (typeof message === 'object') {
    return message
  }
  return NODE_COLOR[LOG_LEVEL[level].color].replace('%s', message)
}
