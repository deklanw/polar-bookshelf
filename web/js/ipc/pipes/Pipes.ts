import { PipeNotification, ReadablePipe } from './Pipe';

export class Pipes {
    public static when<E, M>(pipe: ReadablePipe<E, M>, channel: string) {
        return new Promise<PipeNotification<E, M>>(resolve => {
            pipe.once(channel, notification => {
                resolve(notification);
            });
        });
    }
}
