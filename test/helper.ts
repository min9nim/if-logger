export function timer(timeout: number) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}
