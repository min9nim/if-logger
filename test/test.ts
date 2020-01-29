import {createLogger} from '../src'

const time: any = () => String(new Date()).substr(16, 8)
const logger = createLogger({tags: [time]})

logger.info('some log') // print '[info] some log'
logger.if(true).info('some log') // print '[info] some log'
logger.if(false).info('some log') // do not print

// predicate function is usable
logger.if(() => false).info('some log') // do not print
