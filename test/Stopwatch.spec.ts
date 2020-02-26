import sinon from 'sinon'
import createLogger from '../src/index'
import {expect} from 'chai'
import consoleTransport from '../src/console-transport'

describe('Stopwatch', () => {
  let transport: any = consoleTransport
  const origin = transport
  beforeEach(() => {
    transport = sinon.spy()
  })
  afterEach(() => {
    transport = origin
  })
  it('should be called transport', () => {
    const logger = createLogger({transports: [transport]})
    const sw = logger.info.stopwatch
    sw.start('test')
    sw.check('aa')
    expect(transport.calledTwice).to.be.equal(true)
  })
  it('should be printed elapsed time', () => {
    const logger = createLogger({transports: [transport]})
    const sw = logger.info.stopwatch
    sw.start('test')
    sw.check('aa')
    sw.check('bb')
    expect(transport.getCall(0).args[1]).to.be.equal('[test] start')
    expect(transport.getCall(1).args[1].includes('[test] aa')).to.be.equal(true)
    expect(transport.getCall(2).args[1].includes('[test] bb')).to.be.equal(true)
  })
  it('should be reset times when reset called', () => {
    const logger = createLogger({transports: [transport]})
    const sw = logger.info.stopwatch
    sw.start('test')
    sw.check('aa')
    sw.reset()
    expect(sw.times.length).to.be.equal(0)
  })
})
