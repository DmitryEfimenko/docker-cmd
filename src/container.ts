import { run, runWithoutDebug, addOpts, addOpt, Log, IProgress, resToJSON } from './base';
import { Machine } from './machine';
import { CommonMethods } from './commonMethods';
var tcpPortUsed = require('tcp-port-used');

export class Container extends CommonMethods {
  constructor(machineName: string) {
    super(machineName);
  }

  waitForPort(opts: IWaitForPortOpts) {
    return new Promise((resolve, reject) => {
      if (!opts.retryIntervalMs) { opts.retryIntervalMs = 100; }
      if (!opts.timeoutMs) { opts.timeoutMs = 5000; }
      let progress = Log.infoProgress(this.isDebug, 'waiting for port', opts.port.toString());
      if (!opts.host) {
        let machine = new Machine(this.machineName);
        machine.ipAddress().then(
          (ipAddress) => {
            opts.host = ipAddress;
            this.runWaitForPort(opts, progress).then(resolve, reject);
          },
          (err) => { reject(err); }
        );
      } else {
        this.runWaitForPort(opts, progress).then(resolve, reject);
      }
    });
  }

  private runWaitForPort(opts: IWaitForPortOpts, progress: IProgress) {
    return tcpPortUsed.waitUntilUsedOnHost(opts.port, opts.host, opts.retryIntervalMs, opts.timeoutMs).finally(() => {
      Log.terminateProgress(progress);
    });
  }

  start(imageName: string, opts?: IStartDockerOpts, command?: string, extraOpts?: IStartExtraOpts) {
    let self = this;
    return new Promise<boolean>((resolve, reject) => {
      let containerName = (opts && opts.name) ? opts.name : imageName;
      let progress = Log.infoProgress(this.isDebug, `Checking if container "${containerName}" needs to be started`);
      this.runWithoutDebugOnce(this.status(containerName)).then(
        (status) => {
          if (status === undefined) {
            progress = Log.terminateProgress(progress)
              .infoProgress(this.isDebug, `Creating and starting container "${containerName}"`);
            startContainer(containerName, progress).then(resolve, reject);
          } else if (status === 'Created') {
            if (extraOpts && extraOpts.startFresh) {
              progress = Log.terminateProgress(progress).infoProgress(this.isDebug, `Container needs to be re-created`);
              removeAndStart(containerName, progress).then(resolve, reject);
            } else {
              progress = Log.terminateProgress(progress)
                .infoProgress(this.isDebug, `Container "${containerName}" exists, but not started - starting now.`);
              startContainer(containerName, progress).then(resolve, reject);
            }
          } else if (status.indexOf('Up') === 0) {
            if (extraOpts && extraOpts.startFresh) {
              progress = Log.terminateProgress(progress).infoProgress(this.isDebug, `Container needs to be re-created`);
              removeAndStart(containerName, progress).then(resolve, reject);
            } else {
              Log.terminateProgress(progress).info(`Container "${containerName}"" already started.`);
              resolve(true);
            }
          } else if (status.indexOf('Exited') === 0) {
            if (extraOpts && extraOpts.startFresh) {
              Log.terminateProgress(progress).info(`Container needs to be re-created`);
              removeAndStart(containerName, progress).then(resolve, reject);
            } else {
              Log.terminateProgress(progress).info(`Container "${containerName}"" exists but is not started. Starting now.`);
              runWithoutDebug(`docker start ${containerName}`, this.machineName).then(
                () => { resolve(false); },
                reject
              );
            }
          } else {
            Log.terminateProgress(progress);
            reject(`Could not start container ${containerName}. Status was "${status}". Should never hit this.`);
          }
        },
        (err) => {
          Log.terminateProgress(progress);
          reject(err);
        }
      );
    });

    function removeAndStart(containerName: string, progress: IProgress) {
      return new Promise<boolean>((resolve, reject) => {
        self.remove(containerName).then(
          () => {
            startContainer(containerName, progress).then(resolve, reject);
          },
          (err) => { reject(err); }
        );
      });
    }

    function startContainer(containerName: string, progress: IProgress) {
      return new Promise((resolve, reject) => {
        let c = `docker run -d`;
        if (!opts) { opts = {}; }
        c = addOpts(c, opts);
        // set sinsible defaults
        if (!opts.name) { c = addOpt(c, '--name', containerName); }
        c += ` ${imageName}`;
        if (command) { c += ` ${command}`; }
        run(c, self.machineName, self.isDebug).then(
          () => {
            Log.terminateProgress(progress).info(`Container "${containerName}" started.`);
            resolve(false);
          },
          (err) => {
            Log.terminateProgress(progress);
            reject(err);
          }
        );
      });
    }
  }

  remove(containerName: string) {
    return new Promise<boolean>((resolve, reject) => {
      let c = `docker rm -f ${containerName}`;
      run(c, this.machineName, this.isDebug).then(
        () => { resolve(true); },
        (err) => { reject(err); }
      );
    });
  }

  status(containerName: string) {
    return new Promise<string>((resolve, reject) => {
      let c = `docker ps -a --filter name=${containerName} --format "table {{.Names}}\t{{.Status}}"`;
      run(c, this.machineName, this.isDebug).then(
        (res) => {
          //console.dir(res);
          let json = resToJSON(res);
          let status;
          for (var i = 0, l = json.length; i < l; i++) {
            if (json[i]['NAMES'] === containerName) {
              status = json[i]['STATUS'];
              break;
            }
          }
          resolve(status);
        },
        (err) => { reject(err); }
      );
    });
  }
}

export interface IStartDockerOpts {
  name?: string;
  publish?: string | string[];
  volume?: string;
  volumesFrom?: string | string[];
  link?: string | string[];
  env?: string | string[];
  tty?: boolean;
}

export interface IStartExtraOpts {
  startFresh?: boolean;
}

export interface IWaitForPortOpts {
  port: number;
  host?: string;
  retryIntervalMs?: number;
  timeoutMs?: number;
}
