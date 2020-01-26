import sinon from 'sinon'
import {createLogger} from '../src'
import {expect} from 'chai'

describe('logger', () => {
  const originLog = console.log
  const originInfo = console.info
  const originTime = console.time
  const originTimeEnd = console.timeEnd
  const originWarn = console.warn
  const originError = console.error
  beforeEach(() => {
    console.log = sinon.spy()
    console.info = sinon.spy()
    console.time = sinon.spy()
    console.timeEnd = sinon.spy()
    console.warn = sinon.spy()
    console.error = sinon.spy()
  })
  afterEach(() => {
    console.log = originLog
    console.info = originInfo
    console.time = originTime
    console.timeEnd = originTimeEnd
    console.warn = originWarn
    console.error = originError
  })
  it('should be called console.log', () => {
    const logger = createLogger({level: 'all'})
    logger.info('test')
    // @ts-ignore
    expect(console.info.calledOnce).to.be.equal(true)
    // @ts-ignore
    expect(console.info.getCall(0).args[0]).to.be.equal('[info]')
    // @ts-ignore
    expect(console.info.getCall(0).args[1]).to.be.equal('test')
  })
  it('should not be called console.log when log_level is higher than current log', () => {
    const logger = createLogger({level: 'warn'})
    logger.info('test')
    // @ts-ignore
    expect(console.info.calledOnce).to.be.equal(false)
  })
  it('should be called console.warn when called logger.warn', () => {
    const logger = createLogger({level: 'warn'})
    logger.warn('test')
    // @ts-ignore
    expect(console.warn.calledOnce).to.be.equal(true)
  })
  it('should be called console.error when called logger.error', () => {
    const logger = createLogger({level: 'all'})
    logger.error('test')
    // @ts-ignore
    expect(console.error.calledOnce).to.be.equal(true)
  })
  it('should be called console.time', () => {
    const logger = createLogger({level: 'info'})
    logger.info.time('time check')
    // @ts-ignore
    expect(console.time.calledOnce).to.be.equal(true)
  })
  it('should be called console.timeEnd', () => {
    const logger = createLogger({level: 'info'})
    logger.info.timeEnd('time check')
    // @ts-ignore
    expect(console.timeEnd.calledOnce).to.be.equal(true)
  })
  it('should not be called console.log when pred return false', () => {
    const logger = createLogger({level: 'info'})
    logger.if(() => false).info('info')
    // @ts-ignore
    expect(console.info.calledOnce).to.be.equal(false)
  })
  it('should not be called console.log when pred is false', () => {
    const logger = createLogger({level: 'info'})
    logger.if(false).info('info')
    // @ts-ignore
    expect(console.info.calledOnce).to.be.equal(false)
    logger.info('info')
    // @ts-ignore
    expect(console.info.calledOnce).to.be.equal(true)
  })
  it('should be called console.log when pred return true', () => {
    const logger = createLogger({level: 'info'})
    logger.if(() => true).info('info')
    // @ts-ignore
    expect(console.info.calledOnce).to.be.equal(true)
  })
  it('should be called console.log when pred is true', () => {
    const logger = createLogger({level: 'info'})
    logger.if(true).info('info')
    // @ts-ignore
    expect(console.info.calledOnce).to.be.equal(true)
  })
  it('should be printed tags', () => {
    const logger = createLogger({level: 'all', tags: ['a', 'b']})
    logger.info('hello')
    // @ts-ignore
    expect(console.info.getCall(0).args[0]).to.be.equal('[info][a][b]')
    // @ts-ignore
    expect(console.info.getCall(0).args[1]).to.be.equal('hello')
  })
  it('should be filtered tags when tagFilter is set', () => {
    const logger = createLogger({level: 'all', tags: ['a', 'b'], tagFilter: ['a']})
    logger.info('hello')
    logger.tags(['c']).info('hello2')
    // @ts-ignore
    expect(console.info.getCall(0).args[0]).to.be.equal('[info][a][b]')
    // @ts-ignore
    expect(console.info.getCall(0).args[1]).to.be.equal('hello')
    // @ts-ignore
    expect(console.info.calledTwice).to.be.equal(false)
    logger.tags(['a']).info('hello3')
    // @ts-ignore
    expect(console.info.calledTwice).to.be.equal(true)
  })
  it('should be printed formatted message', () => {
    function format(level, tags, message) {
      const tagstr = tags.join(',')
      return `(${level})(${tagstr}) ${message}`
    }
    const logger = createLogger({format})

    logger.tags(['AA', 'BB']).verbose('some text')
    // @ts-ignore
    expect(console.log.getCall(0).args[0]).to.be.equal('(verbose)(AA,BB) some text')
  })
})
