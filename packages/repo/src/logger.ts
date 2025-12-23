// Web platform compatible logger
// Uses console methods by default, but can be replaced with a custom logger
// (e.g., pino-based subsystemLogger from @atproto/common for Node.js environments)

type LogFn = (obj: Record<string, unknown>, msg?: string) => void

export interface Logger {
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

const defaultLogger: Logger = {
  debug: createLogFn('debug'),
  info: createLogFn('info'),
  warn: createLogFn('warn'),
  error: createLogFn('error'),
}

// Allow users to provide a custom logger (e.g., pino-based logger from @atproto/common)
let currentLogger: Logger = defaultLogger

export function setLogger(logger: Logger): void {
  currentLogger = logger
}

export function getLogger(): Logger {
  return currentLogger
}

// Export a proxy that delegates to the current logger
export const logger: Logger = {
  debug: (obj, msg) => currentLogger.debug(obj, msg),
  info: (obj, msg) => currentLogger.info(obj, msg),
  warn: (obj, msg) => currentLogger.warn(obj, msg),
  error: (obj, msg) => currentLogger.error(obj, msg),
}

export default logger
