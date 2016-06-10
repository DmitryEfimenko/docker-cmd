import * as Q from 'q';
import { RunResult } from './childProcessHelpers';
export declare function run(command: string, _debug: boolean, noNewLines?: boolean): Q.Promise<string>;
export declare function runSync(command: string, _debug: boolean): RunResult;
export declare function runWithoutDebug(command: string, noNewLines?: boolean): Q.Promise<string>;
export declare function addOpt(command: string, optionName: string, optionVal?: string | string[] | boolean): string;
export declare function addOpts(command: string, opts: any): string;
export declare function resToJSON(s: string): any[];
export declare class Log {
    static success(...message: string[]): void;
    static err(...message: string[]): void;
    static info(...message: string[]): void;
    static infoProgress(...message: string[]): NodeJS.Timer;
    static terminateInterval(interval: NodeJS.Timer): typeof Log;
}
