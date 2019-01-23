import { Pipe, PipeListener, PipeNotification } from './Pipe';

export class MockPipes<E, M> {
    public readonly left: MockPipe<E, M>;
    public readonly right: MockPipe<E, M>;

    constructor(left: MockPipe<E, M>, right: MockPipe<E, M>) {
        this.left = left;
        this.right = right;
    }

    public static create<E, M>(): MockPipes<E, M> {
        const left = new MockPipe<E, M>('left');
        const right = new MockPipe<E, M>('right');

        left.target = right;
        right.target = left;

        return new MockPipes<E, M>(left, right);
    }
}

export class MockPipe<E, M> extends Pipe<E, M> {
    private name: string;

    public target?: MockPipe<E, M>;

    constructor(name: string) {
        super();
        this.name = name;
    }

    protected onListeners: ListenerMap<E, M> = new ListenerMap();

    protected onceListeners: ListenerMap<E, M> = new ListenerMap();

    public write(channel: string, msg: M): void {
        if (!this.target) {
            throw new Error('No target');
        }

        const notification = new PipeNotification<E, M>(channel, <E>{}, msg);

        // deliver the messages to the target now...

        this.target.onListeners.get(channel).forEach(listener => {
            listener(notification);
        });

        this.target.onceListeners.get(channel).forEach(listener => {
            listener(notification);
        });

        this.target.onceListeners.clear(channel);
    }

    public on(channel: string, listener: PipeListener<E, M>) {
        this.onListeners.register(channel, listener);
    }

    public once(channel: string, listener: PipeListener<E, M>) {
        this.onceListeners.register(channel, listener);
    }

    public when(channel: string): Promise<PipeNotification<E, M>> {
        return new Promise<PipeNotification<E, M>>(resolve => {
            this.once(channel, notification => {
                resolve(notification);
            });
        });
    }
}

class ListenerMap<E, M> {
    private backing: { [index: string]: Array<PipeListener<E, M>> } = {};

    public register(channel: string, listener: PipeListener<E, M>): void {
        if (!(channel in this.backing)) {
            this.backing[channel] = [];
        }

        this.backing[channel].push(listener);
    }

    public get(channel: string): Array<PipeListener<E, M>> {
        const result = this.backing[channel];

        if (result) {
            return result;
        } else {
            return [];
        }
    }

    public clear(channel: string) {
        delete this.backing[channel];
    }
}
