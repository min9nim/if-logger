"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
exports.LOG_LEVEL = {
    off: {
        priority: 0,
    },
    error: {
        priority: 1,
        color: 'red',
    },
    warn: {
        priority: 2,
        color: 'yellow',
    },
    log: {
        priority: 3,
        color: 'white',
    },
    info: {
        priority: 4,
        color: 'green',
    },
    verbose: {
        priority: 5,
        color: 'yellow',
    },
    debug: {
        priority: 6,
        color: 'blue',
    },
    all: {
        priority: 7,
    },
};
exports.DEFAULT_OPTIONS = {
    tagFilter: [],
    levelFilter: [],
    level: 'all',
    tags: [],
    transports: [consoleTransport],
};
function createLogger(options = exports.DEFAULT_OPTIONS) {
    const logger = {
        options: Object.assign(Object.assign(Object.assign({}, exports.DEFAULT_OPTIONS), { ifResult: true }), options),
        if(pred) {
            return createLogger(Object.assign(Object.assign({}, this.options), { ifResult: typeof pred === 'function' ? pred() : pred }));
        },
        tags(tags) {
            return createLogger(Object.assign(Object.assign({}, this.options), { tags }));
        },
    };
    Object.keys(exports.LOG_LEVEL).forEach(level => {
        if (['off', 'all'].includes(level)) {
            return;
        }
        logger[level] = buildPrintLog(level, level);
        logger[level].time = buildPrintLog(level, 'time').bind(logger);
        logger[level].timeEnd = buildPrintLog(level, 'timeEnd').bind(logger);
    });
    return logger;
}
exports.createLogger = createLogger;
function buildPrintLog(level, prop) {
    return function printLog(...args) {
        if (!isGo(this.options, level)) {
            return;
        }
        if (typeof args[0] === 'function') {
            args[0]();
            return;
        }
        const header = [level, ...(this.options.tags || [])].map(str => '[' + str + ']').join('');
        let message = header + ' ' + args[0];
        if (this.options.format) {
            if (typeof this.options.format !== 'function') {
                throw Error('format option should be a function');
            }
            message = this.options.format(level, this.options.tags || [], args[0]);
        }
        else if (args.length > 1 || typeof args[0] === 'object') {
            console.log(header, ...args);
            return;
        }
        const colorMessage = chalk_1.default[exports.LOG_LEVEL[level].color](message);
        if (['time', 'timeEnd'].includes(prop)) {
            message = time[prop](message);
            if (prop === 'time') {
                return;
            }
        }
        if (!this.options.transports) {
            throw Error('transports is not defined');
        }
        return this.options.transports.map(transport => transport(level, message, colorMessage));
    };
}
function isGo(options, level) {
    if (!options.ifResult) {
        return false;
    }
    if (exports.LOG_LEVEL[options.level].priority < exports.LOG_LEVEL[level].priority) {
        return false;
    }
    if (options.levelFilter.length > 0 && !options.levelFilter.includes(level)) {
        return false;
    }
    if (options.tagFilter.length > 0 && !options.tagFilter.some(tag => options.tags.includes(tag))) {
        return false;
    }
    return true;
}
const time = {
    timeLabels: {},
    time(label) {
        if (this.timeLabels[label]) {
            throw Error(`duplicate label [${label}]`);
        }
        this.timeLabels[label] = Date.now();
    },
    timeEnd(label) {
        const asisTime = this.timeLabels[label];
        if (!asisTime) {
            throw Error(`Not found label [${label}]`);
        }
        this.timeLabels[label] = undefined;
        return label + ' ' + (Date.now() - asisTime) + 'ms';
    },
};
function consoleTransport(level, message, colorMessage) {
    if (!console[level]) {
        console.log(colorMessage);
        return;
    }
    console[level](colorMessage);
}
exports.consoleTransport = consoleTransport;
//# sourceMappingURL=index.js.map