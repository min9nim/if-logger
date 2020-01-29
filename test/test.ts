import {createLogger} from '../src'

const logger = createLogger()

logger.info('some log') // print '[info] some log'
logger.if(true).info('some log') // print '[info] some log'
logger.if(false).info('some log') // do not print

// predicate function is usable
logger.if(() => false).info('some log') // do not print
