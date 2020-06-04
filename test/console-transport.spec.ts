import createLogger, {consoleTransport} from '../src'
import {expect} from 'chai'
import {consoleTransportBrowser, consoleTransportNode} from '../src/console-transport'
import {timer} from './helper'

describe('consoleTransport', () => {
  it('consoleTransportNode', async () => {
    const logger = createLogger({
      timeEndLimit: 50,
      returnValue: true,
      transports: [consoleTransportNode],
    }).addTags('abc')
    logger.verbose.time('**')
    await timer(100)
    const result = logger.verbose.timeEnd('**')
    expect(result[0][1].includes('31m')).to.be.equal(true)
  })
  it('consoleTransportBrowser', async () => {
    const logger = createLogger({
      timeEndLimit: 50,
      returnValue: true,
      transports: [consoleTransportBrowser],
    }).addTags('abc')
    logger.verbose.time('**')
    await timer(100)
    const result = logger.verbose.timeEnd('**')
    expect(result[0][0].match(/%c/g)).to.be.deep.equal(['%c', '%c'])
    expect(result[0][1]).to.be.equal('color:gray')
    expect(result[0][2]).to.be.equal('color:red')
  })
  it('consoleTransport exported', () => {
    expect(consoleTransport).to.be.a('function')
  })
})
