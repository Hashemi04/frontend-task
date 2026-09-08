export function isNotFoundError(error: unknown) {
  if (!error || typeof error !== 'object' || !('statusCode' in error)) {
    return false
  }

  return Number((error as { statusCode: unknown }).statusCode) === 404
}
