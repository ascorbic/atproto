// No-op logger for web platform compatibility.
// Logging was previously handled by pino via @atproto/common.
// To avoid behavioral changes, logging is now disabled by default.
// Consumers can observe repo operations through their own instrumentation.

type LogFn = (obj: Record<string, unknown>, msg?: string) => void

interface Logger {
  debug: LogFn
  info: LogFn
  warn: LogFn
  error: LogFn
}

const noop: LogFn = () => {}

export const logger: Logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
}

export default logger
