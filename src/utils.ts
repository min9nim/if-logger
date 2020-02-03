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
  return typeof process !== 'undefined' && process.versions && process.versions.node
}
