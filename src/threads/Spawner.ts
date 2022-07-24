import { IThreadSpawner } from "./typings";
import os from 'os';
import path from 'path';
import { Worker } from 'worker_threads';
import chalk from 'chalk';

export class ThreadSpawner implements IThreadSpawner {
    private threadsAmount: number = Math.round(os.cpus().length / 2);
    private workers: { worker: Worker; id: number }[] = [];
    private workerMessages: any[] = [];

    public async spawn(pathsToXmls: string[]): Promise<void> {
        const threadGroups = await this.distribute(pathsToXmls);
        for (const group of threadGroups) {
            const worker = new Worker('./src/threads/worker', { workerData: group });
            this.workers.push({ worker, id: worker.threadId });
        }
        await this.listenWorkers();
    }

    private async distribute(paths: string[]): Promise<string[][]> {
        const groups: string[][] = [...new Array(this.threadsAmount)].map(() => []);

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
    }

    private async listenWorkers(): Promise<void> {
        let workerAmountInProcess: number = this.workers.length;
        let workerPercent = Math.round(100 / this.workers.length);
        let currentPercent = 0;
        for (const { worker, id } of this.workers) {
            worker.on('error', (err) => {
                throw new Error(`${chalk.bold.red(err.message)}:\n\t${err.stack}`);
            });

            worker.on('message', (msg) => {
                this.workerMessages.push(msg);
            });
            worker.on('exit', (code) => {
                if (this.workers.length === workerAmountInProcess) {
                    console.log(chalk.yellow(`Parsing: ${currentPercent}%`));
                    currentPercent += workerPercent;
                } else {
                    currentPercent += workerPercent;
                    console.log(chalk.yellow(`Parsing: ${currentPercent}%`));
                }

                workerAmountInProcess -= 1;
                if (code === 0 && !workerAmountInProcess) {
                    console.log(chalk.bold.green('\nWorkers successfully processed the data! \n'));
                    console.log(chalk.bold.cyan('JSONs files are in the following path: \t'));
                    console.log(chalk.bold.underline(path.resolve(process.cwd(), '../json')));
                    console.log(chalk.bold('\n All messages from workers: '), JSON.stringify(this.workerMessages))
                } else if (code !== 0) {
                    console.log(chalk.bold.red(`\n Worker ended with code : ${code}. Thread ID: ${id}`));
                }
            })
        }
    }
} 
