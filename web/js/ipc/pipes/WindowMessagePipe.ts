import { Pipe, PipeListener, PipeNotification } from './Pipe';
import { IPCEvent } from '../handler/IPCEvent';
import { Pipes } from './Pipes';
import { WritablePipes } from '../handler/WritablePipes';

export class WindowMessagePipe implements Pipe<IPCEvent, any> {
    public on(channel: string, listener: PipeListener<IPCEvent, any>): void {
        window.addEventListener(
            'message',
            WindowMessagePipe.createListener(channel, listener)
        );
    }

    public once(channel: string, listener: PipeListener<IPCEvent, any>): void {
        const messageListener = WindowMessagePipe.createListener(
            channel,
            listener
        );

        window.addEventListener('message', (event: any) => {
            if (messageListener(event)) {
                window.removeEventListener('message', messageListener);
            }
        });
    }

    public when(channel: string): Promise<PipeNotification<IPCEvent, any>> {
        return Pipes.when(this, channel);
    }

    public write(channel: string, message: any): void {
        throw new Error('Not implemented');
    }

    public static createListener(
        channel: string,
        listener: PipeListener<IPCEvent, any>
    ): WindowMessageListener {
        return (event: any) => {
            if (
                event &&
                event.data &&
                event.data.channel &&
                event.data.channel == channel
            ) {
                const data = event.data;
                const writablePipe = WindowMessagePipe.createWritablePipe(
                    channel,
                    event
                );
                const ipcEvent = new IPCEvent(writablePipe, data.message);
                listener(new PipeNotification(channel, ipcEvent, data.message));
                return true;
            }
            return false;
        };
    }

    public static createWritablePipe(channel: string, event: any) {
        return WritablePipes.createFromFunction((channel, message: any) => {
            event.sender.postMessage({ channel, message }, '*');
        });
    }
}

type WindowMessageListener = (event: any) => boolean;
