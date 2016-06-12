import * as Q from 'q';
import { CommonMethods } from './commonMethods';
export declare class Container extends CommonMethods {
    waitForPort(opts: IWaitForPortOpts): any;
    static waitForPort(opts: IWaitForPortOpts): Q.Promise<{}>;
    private static runWaitForPort(opts);
    start(imageName: any, opts?: IStartDockerOpts, command?: string): any;
    static start(imageName: any, opts?: IStartDockerOpts, command?: string): Q.Promise<{}>;
    status(containerName: string): any;
    static status(containerName: string): Q.Promise<string>;
}
export interface IStartDockerOpts {
    name?: string;
    publish?: string | string[];
    volume?: string;
    volumesFrom?: string | string[];
    link?: string | string[];
    env?: string | string[];
}
export interface IWaitForPortOpts {
    port: number;
    host?: string;
    retryIntervalMs?: number;
    timeoutMs?: number;
}
