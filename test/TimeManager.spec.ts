import sinon from 'sinon'
import createLogger from '../src/index'
import {expect} from 'chai'
import consoleTransport from '../src/console-transport'
import {timer} from './helper'

let transport: any = consoleTransport

describe('TimeManager', () => {
  const origin = transport
  beforeEach(() => {
    transport = sinon.spy()
  })
  afterEach(() => {
    transport = origin
  })
  it('should be printed elapsed time', async () => {
    const logger = createLogger({level: 'info', transports: [transport]})
    logger.info.time('time check')
    await timer(100)
    logger.info.timeEnd('time check')
    expect(/time check \d\d\dms/.test(transport.getCall(0).args[2])).to.be.equal(true)
  })
  it('should be printed elapsed time', async () => {
    const logger = createLogger({level: 'info', timeEndLimit: 50, transports: [transport]})
    logger.info.time('time check')
    await timer(100)
    logger.info.timeEnd('time check')
    // expect(transport.getCall(0).args[2]).to.be.equal(true)
    expect(transport.getCall(0).args[3]).to.be.a('number')
    expect(transport.getCall(0).args[4]).to.be.equal(50)
  })
  it('should be scoped by object', async () => {
    const logger1 = createLogger({level: 'info', transports: [transport]})
    const logger2 = createLogger({level: 'info', transports: [transport]})
    logger1.info.time('time check')
    logger2.info.time('time check')
    await timer(100)
    logger1.info.timeEnd('time check')
    logger2.info.timeEnd('time check')
    expect(/time check \d\d\dms/.test(transport.getCall(0).args[2])).to.be.equal(true)
    expect(/time check \d\d\dms/.test(transport.getCall(1).args[2])).to.be.equal(true)
  })
})
