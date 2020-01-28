import {createLogger} from '../src'

const logger = createLogger()
logger.verbose.time('some text')
logger.verbose.timeEnd('some text')
