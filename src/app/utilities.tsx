export const debounce = <T extends any[]>(
  fn: (...args: T) => void,
  timeout: number,
) => {
  let handle = 0
  let lastArgs: T | null = null
  const ret = (...args: T) => {
    lastArgs = args
    clearTimeout(handle)
    handle = window.setTimeout(() => {
      lastArgs = null
      fn(...args)
    }, timeout)
  }
  ret.flush = () => {
    clearTimeout(handle)
    if (lastArgs) {
      const _lastArgs = lastArgs
      lastArgs = null
      fn(..._lastArgs)
    }
  }
  ret.cancel = () => {
    lastArgs = null
    clearTimeout(handle)
  }
  return ret
}
