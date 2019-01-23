import { Promises } from '../../util/Promises';
import { MockPipes } from './MockPipes';
import { SyncPipe } from './SyncPipe';

describe('SyncPipe', function() {
    it('create sync pipes L->R', async function() {
        const mockChannels: MockPipes<any, string> = MockPipes.create();

        const left = new SyncPipe(mockChannels.left, 'left', 'test');
        const right = new SyncPipe(mockChannels.right, 'right', 'test');

        const leftPromise = Promises.withTimeout(
            1,
            async () => await left.sync()
        );
        const rightPromise = Promises.withTimeout(
            1,
            async () => await right.sync()
        );

        await Promise.all([leftPromise, rightPromise]);
    });

    it('create sync pipes R->L', async function() {
        const mockChannels: MockPipes<any, string> = MockPipes.create();

        const left = new SyncPipe(mockChannels.left, 'left', 'test');
        const right = new SyncPipe(mockChannels.right, 'right', 'test');

        const leftPromise = Promises.withTimeout(
            1,
            async () => await left.sync()
        );
        const rightPromise = Promises.withTimeout(
            1,
            async () => await right.sync()
        );

        await Promise.all([rightPromise, leftPromise]);
    });
});
