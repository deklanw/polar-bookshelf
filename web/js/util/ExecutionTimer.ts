import { Logger } from '../logger/Logger';

const log = Logger.create();

export class ExecutionTimer {
    public static execute<T>(func: () => T) {
        const before = Date.now();

        const result = func();

        const after = Date.now();

        const duration = after - before;

        log.info(`Execution time: ${duration}`);

        return result;
    }

    public static async executeAsync<T>(func: () => Promise<T>): Promise<T> {
        const before = Date.now();

        const result = await func();

        const after = Date.now();

        const duration = after - before;

        log.info(`Execution time: ${duration}`);

        return result;
    }
}
