import {getNodeColorMessage} from '../src/index'
import {expect} from 'chai'

describe('logger', () => {
  describe('getNodeColorMessage', () => {
    it('should return object', () => {
      const result = getNodeColorMessage('info', {a: 1})
      expect(result).to.be.deep.equal({a: 1})
    })
  })
})
