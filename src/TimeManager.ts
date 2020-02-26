import consoleTransport from './console-transport'

export default class TimeManager {
  timeLabels = {}
  time(label: string) {
    if (this.timeLabels[label]) {
      // console.warn(`[error] duplicate label [${label}]`)
      consoleTransport('warn', '', `[warn] duplicate label '${label}'`)
      return
    }
    this.timeLabels[label] = Date.now()
  }
  timeEnd(label: string) {
    const asisTime = this.timeLabels[label]
    if (!asisTime) {
      // console.warn(`[error] Not found label [${label}]`)
      consoleTransport('warn', '', `[warn] Not found label '${label}'`)
      return
    }
    this.timeLabels[label] = undefined
    return Date.now() - asisTime
  }
}
