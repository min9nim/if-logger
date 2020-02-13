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
