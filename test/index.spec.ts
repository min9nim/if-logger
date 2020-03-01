import sinon from 'sinon'
import createLogger from '../src/index'
import {expect} from 'chai'
import consoleTransport from '../src/console-transport'
import packageJson from '../package.json'

let transport: any = consoleTransport
describe('logger', () => {
  const origin = transport
  beforeEach(() => {
    transport = sinon.spy()
  })
  afterEach(() => {
    transport = origin
  })
  describe('basic', () => {
    it('should be called transport', () => {
      const logger = createLogger({transports: [transport]})
      logger.info('test')
      expect(transport.getCall(0).args[0]).to.be.equal('info')
      expect(transport.getCall(0).args[1]).to.be.equal('test')
      expect(transport.getCall(0).args[2]).to.be.equal('[info] test')
    })
    it('should be called console.warn when called logger.warn', () => {
      const logger = createLogger({level: 'warn', transports: [transport]})
      logger.warn('test')

      expect(transport.getCall(0).args[0]).to.be.equal('warn')
      expect(transport.getCall(0).args[2]).to.be.equal('[warn] test')
    })
    it('should be usable dynamic level', () => {
      let level = 'log'
      const logger = createLogger({level: () => level, transports: [transport]})
      logger.verbose('hello')
      expect(transport.calledOnce).to.be.equal(false)
      level = 'all'
      logger.verbose('hello')
      expect(transport.calledOnce).to.be.equal(true)
    })
    it('should have default value when undefined passed', () => {
      const logger = createLogger({level: undefined})
      expect(logger.options.level).to.be.equal('all')
    })
    it('should be returned version', () => {
      const logger = createLogger({transports: [transport]})
      logger.verbose(logger.version)
      expect(transport.getCall(0).args[0]).to.be.equal('verbose')
      expect(transport.getCall(0).args[1]).to.be.equal(packageJson.version)
    })
    describe('function parameter usable', () => {
      it('should be called function parameter', () => {
        const logger = createLogger({transports: [transport]})
        const fn = sinon.spy()
        logger.info(fn)
        expect(fn.calledOnce).to.be.equal(true)
        expect(fn.getCall(0).args[0]).to.be.equal(undefined)
      })
    })

    describe('plain object usable', () => {
      it('should be printed object', () => {
        const origin = console.log
        console.log = sinon.spy()
        const logger = createLogger({transports: [transport]})
        logger.log({a: 1})
        // @ts-ignore
        expect(console.log.getCall(0).args[1]).to.be.deep.equal({a: 1})
        console.log = origin
      })
    })
  })

  describe('options', () => {
    describe('tags', () => {
      it('should be printed tags', () => {
        const logger = createLogger({level: 'all', tags: ['a', 'b'], transports: [transport]})
        logger.info('hello')

        expect(transport.getCall(0).args[2]).to.be.equal('[info][a][b] hello')
      })
    })
    describe('tagFilter', () => {
      it('should be filtered tags when tagFilter is set', () => {
        const logger = createLogger({
          level: 'all',
          tags: ['a', 'b'],
          tagFilter: ['a'],
          transports: [transport],
        })
        logger.info('hello')

        expect(transport.getCall(0).args[2]).to.be.equal('[info][a][b] hello')
        logger.tags(['c']).info('hello2')

        expect(transport.getCall(1)).to.be.equal(null)
        logger.tags(['a']).info('hello3')

        expect(transport.getCall(1).args[2]).to.be.equal('[info][a] hello3')
      })
    })
    describe('returnValue', () => {
      it('should be returned undefined', () => {
        const logger = createLogger({transports: [transport]})
        const result = logger.info('hello')
        expect(result).to.be.equal(undefined)
      })
      it('should return result when returnValue is true', () => {
        const logger = createLogger({transports: [transport], returnValue: true})
        const result = logger.info('hello')
        expect(Array.isArray(result)).to.be.equal(true)
      })
    })
    describe('format', () => {
      it('should be printed formatted message', () => {
        function format(level, tags, message) {
          const tagstr = tags.join(',')
          return `(${level})(${tagstr}) ${message}`
        }
        const logger = createLogger({format, transports: [transport]})

        logger.tags(['AA', 'BB']).verbose('some text')

        expect(transport.getCall(0).args[2]).to.be.equal('(verbose)(AA,BB) some text')
      })
    })
    describe('level', () => {
      it('should not be called transport when log_level is higher than current log', () => {
        const logger = createLogger({level: 'warn', transports: [transport]})
        logger.info('test')
        expect(transport.calledOnce).to.be.equal(false)
      })
    })
    describe('pred', () => {
      it('should be usable pred option', () => {
        let cnt = 0
        const only3times = () => {
          cnt++
          return cnt < 4
        }
        const logger = createLogger({transports: [transport], pred: only3times})
        logger.info('some text 1')
        logger.info('some text 2')
        logger.info('some text 3') // print 'some text' if `pred` is only true
        logger.info('some text 4')
        logger.info('some text 5')
        expect(transport.calledThrice).to.be.equal(true)
      })
    })
  })

  describe('method', () => {
    describe('tags', () => {
      it('should be set new tags', () => {
        const logger = createLogger({transports: [transport], tags: ['11']})
        logger.info('hello')
        expect(transport.getCall(0).args[2]).to.be.equal('[info][11] hello')
        logger.tags(['22']).info('hello')
        expect(transport.getCall(1).args[2]).to.be.equal('[info][22] hello')
        logger.tags('33', '44').info('hello')
        expect(transport.getCall(2).args[2]).to.be.equal('[info][33][44] hello')
      })
    })
    describe('addTags', () => {
      it('should be added new tags', () => {
        const logger = createLogger({transports: [transport], tags: ['11']})
        logger.info('hello')
        expect(transport.getCall(0).args[2]).to.be.equal('[info][11] hello')
        logger.addTags(['22']).info('hello')
        expect(transport.getCall(1).args[2]).to.be.equal('[info][11][22] hello')
        logger.addTags('33', '44').info('hello')
        expect(transport.getCall(2).args[2]).to.be.equal('[info][11][33][44] hello')
      })
    })
    describe('new', () => {
      it('should return new logger', () => {
        const logger = createLogger({transports: [transport]})
        const newLogger = logger.new({tags: ['11']})
        expect(logger.options.tags).to.be.deep.equal([])
        expect(newLogger.options.tags).to.be.deep.equal(['11'])
      })
    })
    describe('if', () => {
      it('should be called transport when pred is true', () => {
        const logger = createLogger({level: 'info', transports: [transport]})
        logger.if(true).info('info')
        expect(transport.calledOnce).to.be.equal(true)
      })
      it('should not be called transport when pred return false', () => {
        const logger = createLogger({level: 'info', transports: [transport]})
        logger.if(() => false).info('info')
        expect(transport.calledOnce).to.be.equal(false)
      })
      it('should not be called transport when pred is true', () => {
        const logger = createLogger({transports: [transport]})
        logger.if(false).info('info')
        expect(transport.calledOnce).to.be.equal(false)
        logger.info('info')
        expect(transport.calledOnce).to.be.equal(true)
      })
      it('should be called transport when pred return true', () => {
        const logger = createLogger({level: 'info', transports: [transport]})
        logger.if(() => true).info('info')
        expect(transport.calledOnce).to.be.equal(true)
      })
      it('should not be logged if level is over option level', () => {
        const logger = createLogger({level: 'info', transports: [transport]})
        logger.if(true).verbose('some text')
        expect(transport.calledOnce).to.be.equal(false)
      })
      it('should be evaluated when pred is function', () => {
        const logger = createLogger({transports: [transport]})
        let cnt = 0
        const only3times = () => {
          cnt++
          return cnt < 4
        }
        const ifLogger = logger.if(only3times)
        ifLogger.info('some text 1')
        ifLogger.info('some text 2')
        ifLogger.info('some text 3') // print 'some text' if `pred` is only true
        ifLogger.info('some text 4')
        ifLogger.info('some text 5')
        expect(transport.calledThrice).to.be.equal(true)
      })
      it('should not be logged when pred is undefined', () => {
        const logger = createLogger({transports: [transport]})
        logger.if(undefined).verbose('some text')
        expect(transport.calledOnce).to.be.equal(false)
      })
      it('should not be logged when pred is null', () => {
        const logger = createLogger({transports: [transport]})
        logger.if(null).verbose('some text')
        expect(transport.calledOnce).to.be.equal(false)
      })
      it('should not be logged when pred is 0', () => {
        const logger = createLogger({transports: [transport]})
        logger.if(0).verbose('some text')
        expect(transport.calledOnce).to.be.equal(false)
      })
      it('should not be logged when pred is NaN', () => {
        const logger = createLogger({transports: [transport]})
        logger.if(NaN).verbose('some text')
        expect(transport.calledOnce).to.be.equal(false)
      })
      it('should not be logged when pred is ""', () => {
        const logger = createLogger({transports: [transport]})
        logger.if('').verbose('some text')
        expect(transport.calledOnce).to.be.equal(false)
      })
    })
  })
})
