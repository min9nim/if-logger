## if-logger

`if-logger` is a logger that can be set to log or not dynamically

<br>

## Feachers

- No dependencies on runtime
- Color support both node and browser
- Typescript support

<br>

## Install

```
npm i if-logger
```

<br>

## Usage

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

## Performance test is usable

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

## Plain Object

plain object is loggable

```javascript
import { createLogger } from "if-logger"
const logger = createLogger()

logger.verbose({ a: 1 }) // print [verbose] {a:1}
logger.verbose({ a: 1 }, { b: 2 }) // print [verbose] {a:1} {b:2}
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
function customTransport(level, message, colorMessage) {
  /*
   * level: 'debug'
   * message: 'some text'
   * colorMessage: ['\x1b[36m%s\x1b[0m', 'some text'] (on node) or ['%csome text', 'color: cyan'] (on browser)
   */
  // your transport action
}
```
