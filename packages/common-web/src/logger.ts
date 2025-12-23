// Web platform compatible logger using console.
// Provides the same interface as pino for compatibility with @atproto/common.

export type LogFn = (obj: Record<string, unknown>, msg?: string) => void

export interface Logger {
  debug: LogFn
  info: LogFn
  warn: LogFn
  error: LogFn
}

const createConsoleFn =
  (level: 'debug' | 'info' | 'warn' | 'error'): LogFn =>
  (obj, msg) => {
    if (msg) {
      console[level](msg, obj)
    } else {
      console[level](obj)
    }
  }

const createSubsystemConsoleFn =
  (name: string, level: 'debug' | 'info' | 'warn' | 'error'): LogFn =>
  (obj, msg) => {
    if (msg) {
      console[level](`[${name}] ${msg}`, obj)
    } else {
      console[level](`[${name}]`, obj)
    }
  }

/**
 * Creates a console-based logger for web platform compatibility.
 * API is compatible with pino's subsystemLogger from @atproto/common.
 */
export const subsystemLogger = (name: string): Logger => ({
  debug: createSubsystemConsoleFn(name, 'debug'),
  info: createSubsystemConsoleFn(name, 'info'),
  warn: createSubsystemConsoleFn(name, 'warn'),
  error: createSubsystemConsoleFn(name, 'error'),
})
