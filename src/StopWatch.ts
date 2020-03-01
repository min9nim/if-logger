export default class StopWatch {
  times: any = []
  header
  printLog
  constructor(printLog) {
    this.printLog = printLog
  }
  start(title?: string) {
    this.header = title ? `[${title}] ` : ''
    this.times = [Date.now()]
    this.printLog(this.header + 'start')
  }
  check(label: string) {
    if (this.times.length === 0) {
      this.printLog('[error] start() has not yet been called')
      return
    }
    this.times.push(Date.now())
    let diff = this.times[this.times.length - 1] - this.times[this.times.length - 2]
    let total = this.times[this.times.length - 1] - this.times[0]
    this.printLog(this.header + label + ` (${diff}ms / ${total}ms)`)
  }
  reset() {
    let total = this.times[this.times.length - 1] - this.times[0]
    this.printLog(this.header + `end (total: ${total}ms)`)
    this.times = []
  }
  end() {
    this.reset()
  }
}
