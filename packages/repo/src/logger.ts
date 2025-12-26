import type { subsystemLogger as SubsystemLoggerFn } from '@atproto/common'

/**
 * Console-based logger for environments where @atproto/common is not available.
 * API is compatible with pino's subsystemLogger from @atproto/common.
 */

type Logger = Pick<
  ReturnType<typeof SubsystemLoggerFn>,
  'debug' | 'info' | 'warn' | 'error'
>

const createConsoleLogFn =
  (name: string, level: 'debug' | 'info' | 'warn' | 'error') => (obj, msg) => {
    if (msg) {
      console[level](`[${name}] ${msg}`, obj)
    } else {
      console[level](`[${name}]`, obj)
    }
  }

export const consoleLogger = (name: string): Logger => ({
  debug: createConsoleLogFn(name, 'debug'),
  info: createConsoleLogFn(name, 'info'),
  warn: createConsoleLogFn(name, 'warn'),
  error: createConsoleLogFn(name, 'error'),
})

function createLogger(): Logger {
  try {
    // Try to use logger from @atproto/common if available
    const { subsystemLogger } =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('@atproto/common') as typeof import('@atproto/common')
    return subsystemLogger('repo')
  } catch {
    return consoleLogger('repo')
  }
}

export const logger: Logger = createLogger()

export default logger
