export declare const LOG_LEVEL: {
    off: number;
    error: number;
    warn: number;
    log: number;
    info: number;
    verbose: number;
    debug: number;
    all: number;
};
export declare const DEFAULT_LEVEL = "error";
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
}
export declare function createLogger(options?: ILoggerOption): ILogger;
export {};
