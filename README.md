## if-logger

`if-logger` is a logger that whether logging or not is set dynamically

<br>

## install

```
npm i if-logger
```

<br>

## example

```javascript
import { createLogger } from "if-logger"

const logger = createLogger()

logger.info("some log") // print '[info] some log'
logger.if(true).info("some log") // print '[info] some log'
logger.if(false).info("some log") // do not print

// predicate function is usable
logger.if(() => false).info("some log") // do not print

// time, timeEnd is usable
logger.info.time("performance test")
logger.info.timeEnd("performance test") // print [info] performance test 12.13423sms
```

<br>

## log level

```
off: 0,
error: 1,
warn: 2,
log: 3,
info: 4,
verbose: 5,
debug: 6,
all: 7,
```

```javascript
import { createLogger } from "if-logger"

const logger = createLogger({ level: "info" })

logger.verbose("verbose text") // do not print
logger.log("log text") // will be printed '[log] log text'
```

<br>

## tagging

```javascript
import { createLogger } from "if-logger"

const logger = createLogger({ tag: ["AA", "BB"] }) // default tags is set

// tags is prepended
logger.info("some log") // print '[info][AA][BB] some log'

// tags can be changed dynamically
logger.tags(["CC", "MM"]).info("some log") // print '[info][CC][MM] some log'
```

<br>

## level filter

```javascript
import { createLogger } from "if-logger"

const logger = createLogger({ level: "all", levelFilter: ["error", "info"] })

logger.error("some text") // print
logger.info("some text") // print
logger.log("some text") // do not print
```

<br>

## tag filter

```javascript
import { createLogger } from "if-logger"

const logger = createLogger({ level: "all", tagFilter: ["AB", "BB"] })

logger.tags(["AA", "BB"]).error("some text") // print
logger.tags(["CC", "DD"]).info("some text") // do not print
logger.tags(["EE"]).log("some text") // do not print
logger.tags(["AA"]).log("some text") // print
logger.tags(["AA", "ZZ"]).log("some text") // print
```
