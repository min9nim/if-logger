## if-logger

`if-logger` is a logger that can be set whether to log or not dynamically

<br>

## Feachers

- [Log level support](#log-level)
- No dependencies on runtime
- Color support both node and browser
- Typescript support
- [Performance check support(time, timeEnd)](#performance-check)
- [Custom formating](#custom-format)
- [Custom transport](#custom-transport)

<br>

## Install

```
npm i if-logger
```

<br>

## Usage

dynamically log or not

```javascript
import createLogger from "if-logger"

const logger = createLogger()

logger.info("some log") // print '[info] some log'
logger.if(true).info("some log") // print '[info] some log'
logger.if(false).info("some log") // do not print

// predicate function is usable
logger.if(() => false).info("some log") // do not print
```

<br>

`.if` method return new logger

```javascript
import createLogger from "if-logger"

const logger = createLogger()
let cnt = 0
const only3times = () => {
  cnt++
  return cnt < 4
}
const ifLogger = logger.if(only3times) // or `createLogger({pred: only3times})`
ifLogger.info("some text 1") // print
ifLogger.info("some text 2") // print
ifLogger.info("some text 3") // print
ifLogger.info("some text 4") // do not print
ifLogger.info("some text 5") // do not print
```

<br>

## Log level

```javascript
{
  off: 0,
  error: 1,
  warn: 2,
  log: 3,
  info: 4,
  verbose: 5,
  debug: 6,
  all: 7,   // default
}
```

![](https://telegra.ph/file/0d41bbf5344a00b2c5bd5.png)

```javascript
import createLogger from "if-logger"

const logger = createLogger({ level: "info" })

logger.log("log-text") // will be printed '[log] log-text'
logger.info("info-text") // will be printed '[info] info-text'
logger.verbose("verbose-text") // do not print
```

Dynamic level is also usable

```javascript
import createLogger from "if-logger"

const logger = createLogger({ level: () => "info" }) // level function is evaluated when print log

logger.log("log-text") // will be printed '[log] log-text'
logger.info("info-text") // will be printed '[info] info-text'
logger.verbose("verbose-text") // do not print
```

<br>

## Dynamic change of option

<br>
`.new` method return new logger that has changed option. Other options of new logger is equal to existing logger

```javascript
import createLogger from "if-logger"

const logger = createLogger({ level: "info" })

logger.info("hello 1") // print
logger.verbose("hello 2") // do not print
const logger2 = logger.new({ level: "verbose" })
logger2.info("hello 3") // print
logger2.verbose("hello 4") // print
```

<br>

## Tagging

```javascript
import createLogger from "if-logger"

const logger = createLogger({ tag: ["AA", "BB"] }) // default tags is set

logger.info("some log") // print '[info][AA][BB] some log'

// tags can be changed dynamically
logger.tags(["CC", "DD"]).info("some log") // print '[info][CC][DD] some log'

// parameter also can be spreaded
logger.tags("CC", "DD").info("some log") // print '[info][CC][DD] some log'

// tags can be added dynamically
logger.addTags(["CC", "DD"]).info("some log") // print '[info][AA][BB][CC][DD] some log'

// parameter also can be spreaded
logger.addTags(["CC", "DD"]).info("some log") // print '[info][AA][BB][CC][DD] some log'
```

dynamic tag usable

```javascript
import createLogger from "if-logger"

const time = () => String(new Date()).substr(16, 8)
const logger = createLogger({ tags: [time] })

logger.info("some log") // print '[info][12:40:57] some log'
// some biz logic
logger.info("some log") // print '[info][12:41:12] some log'
// some biz logic
logger.info("some log") // print '[info][12:44:36] some log'
```

<br>

## Log level filter

```javascript
import createLogger from "if-logger"

const logger = createLogger({ level: "all", levelFilter: ["error", "info"] })

logger.error("some text") // print
logger.info("some text") // print
logger.log("some text") // do not print
```

<br>

## Tag filter

```javascript
import createLogger from "if-logger"

const logger = createLogger({ level: "all", tagFilter: ["AB", "BB"] })

logger.tags(["AA", "BB"]).error("some text") // print
logger.tags(["CC", "DD"]).info("some text") // do not print
logger.tags(["EE"]).log("some text") // do not print
logger.tags(["AA"]).log("some text") // print
logger.tags(["AA", "ZZ"]).log("some text") // print
```

<br>

## Performance check

time, timeEnd usable

> scope: `logger` object

```javascript
import createLogger from "if-logger"

const logger = createLogger()

logger.info.time("performance test")
// .. some biz logic excuted
logger.info.timeEnd("performance test") // print '[info] performance test 12ms'
```

<br>

Time logging is supported

> scope: `stopwatch` object

```javascript
import createLogger from "if-logger"

const logger = createLogger()
const sw = logger.info.stopwatch
sw.start("test")
// some biz logic
sw.check("aa")
// some biz logic
sw.check("bb")
// some biz logic
sw.check("cc")
// some biz logic
sw.end()

/* output is
[info] [test] start
[info] [test] aa (7ms / 7ms)
[info] [test] bb (3ms / 10ms)
[info] [test] cc (2ms / 12ms)
[info] [test] end (total: 12ms)
*/
```

<br>

## Custom format

```javascript
import createLogger from "if-logger"

function format(level, tags, message) {
  const tagstr = tags.join(",")
  return `(${level})(${tagstr}) ${message}`
}
const logger = createLogger({ format })

logger.tags(["AA", "BB"]).verbose("some text") // print '(verbose)(AA,BB) some text'
```

<br>

## Plain Object & Multiple arguments

Plain objects and multiple arguments are loggable. But the option of `format`, `transport` and the method of `time`, `timeEnd` are not available at this time. (only console output available)

```javascript
import createLogger from "if-logger"
const logger = createLogger()

logger.verbose({ a: 1 }) // print [verbose] {a:1}
logger.verbose({ a: 1 }, { b: 2 }) // print [verbose] {a:1} {b:2}
logger.verbose("aa", "bb", 11) // print [verbose] aa bb 11
```

<br>

## function argument

function parameter is possible

```javascript
import createLogger from "if-logger"
const logger = createLogger()

logger.verbose(() => {
  console.log("some text")
}) // print 'some text'
```

<br>

## Custom transport

```javascript
import createLogger, { consoleTransport } from "if-logger"
// consoleTransport is default transport
const logger = createLogger({ transports: [consoleTransport, customTransport] })
logger.debug("some text")
function customTransport(level, message, formatMessage) {
  /*
   * level: 'debug'
   * message: 'some text'
   * formatMessage: '[debug] some text'
   */
  // your transport action
}
```
