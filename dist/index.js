"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG_LEVEL = {
    off: 0,
    error: 1,
    warn: 2,
    log: 3,
    info: 4,
    verbose: 5,
    debug: 6,
    all: 7,
};
exports.DEFAULT_OPTIONS = {
    tagFilter: [],
    levelFilter: [],
    ifResult: true,
    level: 'all',
    tags: [],
};
function createLogger(options = exports.DEFAULT_OPTIONS) {
    const logger = {
        options: Object.assign(Object.assign({}, exports.DEFAULT_OPTIONS), options),
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
        const prop = ['error', 'warn', 'debug'].includes(level) ? level : 'log'; // console.info 는 디버깅을 위해 제외해둠
        logger[level] = buildPrintLog(level, prop);
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
            console[prop](header, ...args);
            return;
        }
        if (['time', 'timeEnd'].includes(prop)) {
            // console[prop](message)
            // return
            message = time[prop](message);
            prop = 'log';
        }
        console[prop](message);
    };
}
function isGo(options, level) {
    if (!options.ifResult) {
        return false;
    }
    if (exports.LOG_LEVEL[options.level] < exports.LOG_LEVEL[level]) {
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
//# sourceMappingURL=index.js.map