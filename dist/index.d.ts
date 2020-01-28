export declare const LOG_LEVEL: {
    off: {
        priority: number;
    };
    error: {
        priority: number;
        color: string;
    };
    warn: {
        priority: number;
        color: string;
    };
    log: {
        priority: number;
        color: string;
    };
    info: {
        priority: number;
        color: string;
    };
    verbose: {
        priority: number;
        color: string;
    };
    debug: {
        priority: number;
        color: string;
    };
    all: {
        priority: number;
    };
};
export declare const DEFAULT_OPTIONS: ILoggerOption;
export interface IPrintLog {
    (...args: any[]): void;
    time: (label: string) => void;
    timeEnd: (label: string) => void;
}
export interface ILogger {
    error: IPrintLog;
    warn: IPrintLog;
    log: IPrintLog;
    info: IPrintLog;
    verbose: IPrintLog;
    debug: IPrintLog;
    options: ILoggerOption;
    isGo: (level: string) => boolean;
    if: (pred: (() => boolean) | boolean) => ILogger;
    tags: (tags: string[]) => ILogger;
}
interface ILoggerOption {
    level?: string;
    levelFilter?: string[];
    tags?: string[];
    tagFilter?: string[];
    format?: (level: string, tags: string[], message: string) => string;
    transports?: ((level: string, message: string, colorMessage: string) => any)[];
}
export declare function createLogger(options?: ILoggerOption): ILogger;
export declare function consoleTransport(level: string, message: string, colorMessage: string): void;
export {};
