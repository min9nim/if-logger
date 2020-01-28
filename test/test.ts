import {createLogger} from '../src'

const logger = createLogger()

logger.error('hello')
logger.warn('hello')
logger.log('hello')
logger.info('hello')
logger.verbose('hello')
logger.debug('hello')
