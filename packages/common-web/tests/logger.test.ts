import { subsystemLogger, Logger } from '../src/logger'

describe('logger', () => {
  describe('subsystemLogger', () => {
    it('creates a logger with all log levels', () => {
      const logger = subsystemLogger('test')

      expect(logger).toHaveProperty('debug')
      expect(logger).toHaveProperty('info')
      expect(logger).toHaveProperty('warn')
      expect(logger).toHaveProperty('error')
      expect(typeof logger.debug).toBe('function')
      expect(typeof logger.info).toBe('function')
      expect(typeof logger.warn).toBe('function')
      expect(typeof logger.error).toBe('function')
    })

    it('calls console methods with subsystem prefix', () => {
      const logger = subsystemLogger('myapp')
      const consoleSpy = jest.spyOn(console, 'info').mockImplementation()

      logger.info({ key: 'value' }, 'test message')

      expect(consoleSpy).toHaveBeenCalledWith('[myapp] test message', {
        key: 'value',
      })

      consoleSpy.mockRestore()
    })

    it('handles log calls without message', () => {
      const logger = subsystemLogger('myapp')
      const consoleSpy = jest.spyOn(console, 'debug').mockImplementation()

      logger.debug({ data: 123 })

      expect(consoleSpy).toHaveBeenCalledWith('[myapp]', { data: 123 })

      consoleSpy.mockRestore()
    })

    it('routes to correct console methods', () => {
      const logger = subsystemLogger('test')
      const spies = {
        debug: jest.spyOn(console, 'debug').mockImplementation(),
        info: jest.spyOn(console, 'info').mockImplementation(),
        warn: jest.spyOn(console, 'warn').mockImplementation(),
        error: jest.spyOn(console, 'error').mockImplementation(),
      }

      logger.debug({}, 'debug msg')
      logger.info({}, 'info msg')
      logger.warn({}, 'warn msg')
      logger.error({}, 'error msg')

      expect(spies.debug).toHaveBeenCalledTimes(1)
      expect(spies.info).toHaveBeenCalledTimes(1)
      expect(spies.warn).toHaveBeenCalledTimes(1)
      expect(spies.error).toHaveBeenCalledTimes(1)

      Object.values(spies).forEach((spy) => spy.mockRestore())
    })

    it('satisfies Logger interface', () => {
      const logger: Logger = subsystemLogger('typed')

      // TypeScript compilation is the test - if this compiles, the interface is satisfied
      expect(logger).toBeDefined()
    })
  })
})
