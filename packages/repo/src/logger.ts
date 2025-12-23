// Simple edge-compatible logger
// Uses console methods instead of pino for edge runtime compatibility

type LogFn = (obj: Record<string, unknown>, msg?: string) => void

interface Logger {
  debug: LogFn
  info: LogFn
  warn: LogFn
  error: LogFn
}

const createLogFn =
  (level: string): LogFn =>
  (obj, msg) => {
    if (typeof console !== 'undefined' && console[level as keyof Console]) {
      const logFn = console[level as keyof Console] as (
        ...args: unknown[]
      ) => void
      if (msg) {
        logFn(`[repo] ${msg}`, obj)
      } else {
        logFn('[repo]', obj)
      }
    }
  }

export const logger: Logger = {
  debug: createLogFn('debug'),
  info: createLogFn('info'),
  warn: createLogFn('warn'),
  error: createLogFn('error'),
}

export default logger
