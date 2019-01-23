import { IPCMessage } from './IPCMessage';
import { IPCEvent } from './IPCEvent';

export abstract class IPCHandler<M> {
    public async handle(
        event: IPCEvent,
        ipcMessage: IPCMessage<any>
    ): Promise<any> {
        const message = this.createValue(ipcMessage);
        return this.handleIPC(event, message);
    }

    protected abstract async handleIPC(
        event: IPCEvent,
        message: M
    ): Promise<any>;

    protected abstract createValue(ipcMessage: IPCMessage<any>): M;
}
