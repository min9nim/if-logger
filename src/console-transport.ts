import {ILoggerOption, ILoggerRequired} from './types'
import {isNode, defaultFormat, getHeaderString, getColorMessage, getNodeColorMessage} from './utils'
import {LOG_LEVEL} from './setting'

export function consoleTransportBrowser(
  level: string,
  message: string,
  formatMessage: string,
  time?: number,
  timeEndLimit?: number
) {
  let text = formatMessage
  let colorMessage
  if (time && timeEndLimit && time > timeEndLimit) {
    text = text.replace(/\s\d+ms/, ' %c' + time + 'ms')
    const color = LOG_LEVEL[level].color
    colorMessage = ['%c' + text, 'color:' + color, 'color:red']
  } else {
    colorMessage = getColorMessage(level, text)
  }
  console[console[level] ? level : 'log'](...colorMessage)
  return colorMessage
}

export function consoleTransportNode(
  level: string,
  message: string,
  formatMessage: string,
  time?: number,
  timeEndLimit?: number
) {
  let text = formatMessage
  if (time && timeEndLimit && time > timeEndLimit) {
    text = text.replace(/\s\d+ms/, ' \x1b[31m' + time + 'ms' + '\x1b[0m')
  }
  const colorMessage = getColorMessage(level, text)
  console[console[level] ? level : 'log'](...colorMessage)
  return colorMessage
}

export default (isNode() ? consoleTransportNode : consoleTransportBrowser)
