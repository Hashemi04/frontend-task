if (typeof Object.groupBy !== 'function') {
  Object.groupBy = function groupBy(items, callbackFn) {
    const result = Object.create(null)
    let index = 0
    for (const item of items) {
      const key = callbackFn(item, index++)
      if (!result[key]) {
        result[key] = []
      }
      result[key].push(item)
    }
    return result
  }
}
