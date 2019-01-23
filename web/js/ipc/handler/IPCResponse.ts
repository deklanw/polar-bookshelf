import { IPCMessage } from './IPCMessage';
import { WritablePipe } from '../pipes/Pipe';

/**
 * Simple IPC response mechanism to allow you to send an IPC response without
 * having to worry about IPC internals. You can just send the response directly.
 */
export class IPCResponse {
    private readonly responsePipe: WritablePipe<IPCMessage<any>>;
    private readonly request: IPCMessage<any>;

    constructor(
        responsePipe: WritablePipe<IPCMessage<any>>,
        request: IPCMessage<any>
    ) {
        this.responsePipe = responsePipe;
        this.request = request;
    }

    public send<T>(result: T) {
        const ipcMessage = new IPCMessage<T>('result', result);
        this.responsePipe.write(
            this.request.computeResponseChannel(),
            ipcMessage
        );
    }
}
