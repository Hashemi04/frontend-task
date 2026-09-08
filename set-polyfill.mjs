if (typeof Set.prototype.difference !== 'function') {
  Set.prototype.difference = function difference(other) {
    const result = new Set()
    for (const value of this) {
      if (!other.has(value)) {
        result.add(value)
      }
    }
    return result
  }
}

if (typeof Set.prototype.intersection !== 'function') {
  Set.prototype.intersection = function intersection(other) {
    const result = new Set()
    for (const value of this) {
      if (other.has(value)) {
        result.add(value)
      }
    }
    return result
  }
}

if (typeof Set.prototype.union !== 'function') {
  Set.prototype.union = function union(other) {
    const result = new Set(this)
    for (const value of other) {
      result.add(value)
    }
    return result
  }
}

if (typeof Set.prototype.symmetricDifference !== 'function') {
  Set.prototype.symmetricDifference = function symmetricDifference(other) {
    const result = this.difference(other)
    for (const value of other) {
      if (!this.has(value)) {
        result.add(value)
      }
    }
    return result
  }
}

if (typeof Set.prototype.isDisjointFrom !== 'function') {
  Set.prototype.isDisjointFrom = function isDisjointFrom(other) {
    for (const value of this) {
      if (other.has(value)) {
        return false
      }
    }
    return true
  }
}

if (typeof Set.prototype.isSubsetOf !== 'function') {
  Set.prototype.isSubsetOf = function isSubsetOf(other) {
    for (const value of this) {
      if (!other.has(value)) {
        return false
      }
    }
    return true
  }
}

if (typeof Set.prototype.isSupersetOf !== 'function') {
  Set.prototype.isSupersetOf = function isSupersetOf(other) {
    return other.isSubsetOf(this)
  }
}

