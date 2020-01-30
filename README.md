## if-logger

`if-logger` is a logger that can set whether to log or not dynamically

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
import { createLogger } from "if-logger"

const logger = createLogger()

logger.info("some log") // print '[info] some log'
logger.if(true).info("some log") // print '[info] some log'
logger.if(false).info("some log") // do not print

// predicate function is usable
logger.if(() => false).info("some log") // do not print
```

<br>

dynamically change of level option

```javascript
import { createLogger } from "if-logger"

const logger = createLogger() // default log level: 'all'

logger.info("hello") // print
logger.options.level = "log"
logger.info("hello") // do not print
logger.debug("hello") // do not print
logger.warn("hello") // print
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
import { createLogger } from "if-logger"

const logger = createLogger({ level: "info" })

logger.log("log-text") // will be printed '[log] log-text'
logger.info("info-text") // will be printed '[info] info-text'
logger.verbose("verbose-text") // do not print
```

<br>

## Tagging

```javascript
import { createLogger } from "if-logger"

const logger = createLogger({ tag: ["AA", "BB"] }) // default tags is set

logger.info("some log") // print '[info][AA][BB] some log'

// tags can be changed dynamically
logger.tags(["CC", "MM"]).info("some log") // print '[info][CC][MM] some log'

// add tags
logger.addTags(["CC", "MM"]).info("some log") // print '[info][AA][BB][CC][MM] some log'
```

dynamic tag usable

```javascript
import { createLogger } from "if-logger"

const time = () => String(new Date()).substr(16, 8)
const logger = createLogger({ tags: [time] })

logger.info("some log") // print '[info][12:40:57] some log'
```

<br>

## Log level filter

```javascript
import { createLogger } from "if-logger"

const logger = createLogger({ level: "all", levelFilter: ["error", "info"] })

logger.error("some text") // print
logger.info("some text") // print
logger.log("some text") // do not print
```

<br>

## Tag filter

```javascript
import { createLogger } from "if-logger"

const logger = createLogger({ level: "all", tagFilter: ["AB", "BB"] })

logger.tags(["AA", "BB"]).error("some text") // print
logger.tags(["CC", "DD"]).info("some text") // do not print
logger.tags(["EE"]).log("some text") // do not print
logger.tags(["AA"]).log("some text") // print
logger.tags(["AA", "ZZ"]).log("some text") // print
```

<br>

## Performance check

```javascript
import { createLogger } from "if-logger"

const logger = createLogger()

logger.info.time("performance test")
// .. some biz logic excuted
logger.info.timeEnd("performance test") // print '[info] performance test 12ms'
```

<br>

## Custom format

```javascript
import { createLogger } from "if-logger"

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
import { createLogger } from "if-logger"
const logger = createLogger()

logger.verbose({ a: 1 }) // print [verbose] {a:1}
logger.verbose({ a: 1 }, { b: 2 }) // print [verbose] {a:1} {b:2}
logger.verbose("aa", "bb", 11) // print [verbose] aa bb 11
```

<br>

## function argument

function parameter is possible

```javascript
import { createLogger } from "if-logger"
const logger = createLogger()

logger.verbose(() => {
  console.log("some text")
}) // print 'some text'
```

<br>

## Custom transport

```javascript
import { createLogger, consoleTransport } from "if-logger"
// consoleTransport is default transport
const logger = createLogger({ transports: [consoleTransport, customTransport] })
logger.debug("some text")
function customTransport(level, message) {
  /*
   * level: 'debug'
   * message: '[debug] some text'
   */
  // your transport action
}
```
