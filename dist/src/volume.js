"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
var commonMethods_1 = require("./commonMethods");
var Volume = (function (_super) {
    __extends(Volume, _super);
    function Volume(machineName) {
        return _super.call(this, machineName) || this;
    }
    Volume.prototype.create = function (opts, advOpts) {
        return __awaiter(this, void 0, void 0, function () {
            var res, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        if (!(advOpts && advOpts.createOnlyIfMissing)) return [3, 5];
                        if (!opts || !opts.name) {
                            throw new Error('You must specify name when using "createOnlyIfMissing" option.');
                        }
                        return [4, this.runWithoutDebugOnce(this.inspect(opts.name))];
                    case 1:
                        res = _a.sent();
                        if (!(res.length > 0)) return [3, 2];
                        return [2, res[0].Name];
                    case 2: return [4, this.runCreate(opts)];
                    case 3: return [2, _a.sent()];
                    case 4: return [3, 7];
                    case 5: return [4, this.runCreate(opts)];
                    case 6: return [2, _a.sent()];
                    case 7: return [3, 9];
                    case 8:
                        ex_1 = _a.sent();
                        throw ex_1;
                    case 9: return [2];
                }
            });
        });
    };
    Volume.prototype.inspect = function (volumeName) {
        return __awaiter(this, void 0, void 0, function () {
            var res, json, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, base_1.run("docker volume inspect " + volumeName, this.machineName, this.isDebug)];
                    case 1:
                        res = _a.sent();
                        json = JSON.parse(res);
                        return [2, json];
                    case 2:
                        ex_2 = _a.sent();
                        if (ex_2 === "Error: No such volume: " + volumeName + "\n") {
                            return [2, []];
                        }
                        else {
                            throw ex_2;
                        }
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    Volume.prototype.remove = function (volumeName) {
        return base_1.run("docker volume rm " + volumeName, this.machineName, this.isDebug);
    };
    Volume.prototype.runCreate = function (opts) {
        var c = 'docker volume create';
        if (!opts) {
            opts = {};
        }
        c = base_1.addOpts(c, opts);
        return base_1.run(c, this.machineName, this.isDebug);
    };
    return Volume;
}(commonMethods_1.CommonMethods));
exports.Volume = Volume;
