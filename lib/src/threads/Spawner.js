"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadSpawner = void 0;
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const worker_threads_1 = require("worker_threads");
const chalk_1 = __importDefault(require("chalk"));
class ThreadSpawner {
    constructor() {
        this.threadsAmount = Math.round(os_1.default.cpus().length / 2);
        this.workers = [];
        this.workerMessages = [];
    }
    spawn(pathsToXmls) {
        return __awaiter(this, void 0, void 0, function* () {
            const threadGroups = yield this.distribute(pathsToXmls);
            for (const group of threadGroups) {
                const worker = new worker_threads_1.Worker('./src/threads/worker', { workerData: group });
                this.workers.push({ worker, id: worker.threadId });
            }
            yield this.listenWorkers();
        });
    }
    distribute(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            const groups = [...new Array(this.threadsAmount)].map(() => []);
            let j = 0;
            while (0 < paths.length) {
                if (j === this.threadsAmount) {
                    j = 0;
                }
                const item = paths.splice(0, 1);
                groups[j].push(...item);
                j++;
            }
            return groups;
        });
    }
    listenWorkers() {
        return __awaiter(this, void 0, void 0, function* () {
            let workerAmountInProcess = this.workers.length;
            let workerPercent = Math.round(100 / this.workers.length);
            let currentPercent = 0;
            for (const { worker, id } of this.workers) {
                worker.on('error', (err) => {
                    throw new Error(`${chalk_1.default.bold.red(err.message)}:\n\t${err.stack}`);
                });
                worker.on('message', (msg) => {
                    this.workerMessages.push(msg);
                });
                worker.on('exit', (code) => {
                    if (this.workers.length === workerAmountInProcess) {
                        console.log(chalk_1.default.yellow(`Parsing: ${currentPercent}%`));
                        currentPercent += workerPercent;
                    }
                    else {
                        currentPercent += workerPercent;
                        console.log(chalk_1.default.yellow(`Parsing: ${currentPercent}%`));
                    }
                    workerAmountInProcess -= 1;
                    if (code === 0 && !workerAmountInProcess) {
                        console.log(chalk_1.default.bold.green('\nWorkers successfully processed the data! \n'));
                        console.log(chalk_1.default.bold.cyan('JSONs files are in the following path: \t'));
                        console.log(chalk_1.default.bold.underline(path_1.default.resolve(process.cwd(), '../json')));
                        console.log(chalk_1.default.bold('\n All messages from workers: '), JSON.stringify(this.workerMessages));
                    }
                    else if (code !== 0) {
                        console.log(chalk_1.default.bold.red(`\n Worker ended with code : ${code}. Thread ID: ${id}`));
                    }
                });
            }
        });
    }
}
exports.ThreadSpawner = ThreadSpawner;
