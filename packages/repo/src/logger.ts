// Logger with optional pino support for backwards compatibility.
// If @atproto/common is available (Node.js), uses pino logger.
// Otherwise falls back to no-op for web platform compatibility.

type LogFn = (obj: Record<string, unknown>, msg?: string) => void

interface Logger {
  debug: LogFn
  info: LogFn
  warn: LogFn
  error: LogFn
}

const noop: LogFn = () => {}

const noopLogger: Logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
}

function createLogger(): Logger {
  try {
    // Try to use pino logger from @atproto/common if available
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { subsystemLogger } = require('@atproto/common')
    return subsystemLogger('repo')
  } catch {
    // Fall back to no-op if @atproto/common is not installed
    return noopLogger
  }
}

export const logger: Logger = createLogger()

export default logger
