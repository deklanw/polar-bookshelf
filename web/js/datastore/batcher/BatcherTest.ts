import { assert } from 'chai';
import { ActiveBatch, Batcher, PassiveBatch } from './Batcher';
import { assertJSON } from '../../test/Assertions';

describe('Batcher', function() {
    it('Verify first active and then passive batches.', async function() {
        const mockExecutor = new MockExecutor();

        const batcher = new Batcher(() => mockExecutor.execute());

        const b0 = batcher.enqueue();
        const b1 = batcher.enqueue();

        assert.ok(b0 instanceof ActiveBatch);
        assert.ok(b1 instanceof PassiveBatch);
    });

    it('Stats across iterations', async function() {
        const mockExecutor = new MockExecutor();

        const batcher = new Batcher(() => mockExecutor.execute());

        const b0 = batcher.enqueue();
        const b1 = batcher.enqueue();
        const b2 = batcher.enqueue();

        assert.equal(mockExecutor.completions.length, 3);

        mockExecutor.completions.forEach(completion => completion.resolve());

        await b0.run();

        assert.equal(b0.ticket.executed, true);
        assertJSON(b0, {
            batched: 3,
            batches: 1,
            ticketsPerBatch: [3],
            tickets: [],
            ticket: {
                executed: true,
                promise: {},
            },
        });

        assert.equal(b1.ticket.executed, true);
        assert.equal(b2.ticket.executed, true);
    });
});

class MockExecutor {
    public readonly completions: Array<Completion<void>> = [];

    public resolve: boolean = false;

    public reject: boolean = false;

    public execute(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.resolve) {
                resolve();
                return;
            }

            if (this.reject) {
                reject(new Error('Rejecting result'));
                return;
            }

            this.completions.push({ resolve, reject });
        });
    }
}

interface Completion<T> {
    readonly resolve: () => T;
    readonly reject: (err: Error) => void;
}
