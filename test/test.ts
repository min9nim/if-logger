import {createLogger} from '../src'

const logger = createLogger()
logger.verbose.time('some text')
logger.verbose.timeEnd('some text')
logger.info.time('some text')
logger.info.timeEnd('some text')
logger.debug.time('some text')
logger.debug.timeEnd('some text')
