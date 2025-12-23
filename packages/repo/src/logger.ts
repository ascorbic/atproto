// Logger with optional pino support for backwards compatibility.
// If @atproto/common is available (Node.js), uses pino logger.
// Otherwise uses console logger from @atproto/common-web.

import { subsystemLogger as webLogger, Logger } from '@atproto/common-web'

function createLogger(): Logger {
  try {
    // Try to use pino logger from @atproto/common if available
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { subsystemLogger } = require('@atproto/common')
    return subsystemLogger('repo')
  } catch {
    // Fall back to console logger from common-web
    return webLogger('repo')
  }
}

export const logger: Logger = createLogger()

export default logger
