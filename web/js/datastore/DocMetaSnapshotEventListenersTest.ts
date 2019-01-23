import {
    DocMetaSnapshotEvent,
    DocMetaSnapshotEventListener,
    DatastoreConsistency,
    DocMetaMutation,
    MutationType,
} from './Datastore';
import { DocMetaSnapshotEventListeners } from './DocMetaSnapshotEventListeners';
import { MockDocMetas } from '../metadata/DocMetas';
import { TestingTime } from '../test/TestingTime';
import { ProgressTracker } from '../util/ProgressTracker';
import { assertJSON } from '../test/Assertions';
import { assert } from 'chai';
import { UUIDs } from '../metadata/UUIDs';
import { ASYNC_NULL_FUNCTION, NULL_FUNCTION } from '../util/Functions';
import { AsyncProviders } from '../util/Providers';
import waitForExpect from 'wait-for-expect';
import { DocMetaFileRefs } from './DocMetaRef';
import { MetadataSerializer } from '../metadata/MetadataSerializer';

describe('DocMetaSnapshotEventListener', function() {
    const docMeta = MockDocMetas.createMockDocMeta();

    let emitted: DocMetaSnapshotEvent[] = [];

    let deduplicatedListener: DocMetaSnapshotEventListener = ASYNC_NULL_FUNCTION;

    const progressTracker = new ProgressTracker(1, 'test');
    progressTracker.incr();

    const progress = progressTracker.peek();
    const consistency: DatastoreConsistency = 'committed';

    beforeEach(function() {
        TestingTime.freeze();

        emitted = [];

        const eventDeduplicator = DocMetaSnapshotEventListeners.createDeduplicatedListener(
            async emittedEvent => {
                emitted.push(emittedEvent);
            }
        );

        deduplicatedListener = eventDeduplicator.listener;
    });

    afterEach(function() {
        TestingTime.unfreeze();
    });

    function createDocMetaSnapshotEvent(
        mutationType: MutationType = 'created'
    ): DocMetaSnapshotEvent {
        const docMetaMutation: DocMetaMutation = {
            fingerprint: docMeta.docInfo.fingerprint,
            dataProvider: AsyncProviders.of(
                MetadataSerializer.serialize(docMeta)
            ),
            docMetaProvider: AsyncProviders.of(docMeta),
            docInfoProvider: AsyncProviders.of(docMeta.docInfo),
            docMetaFileRefProvider: AsyncProviders.of(
                DocMetaFileRefs.createFromDocInfo(docMeta.docInfo)
            ),
            mutationType,
        };

        const docMetaSnapshotEvent = {
            datastore: 'memory',
            progress,
            consistency,
            docMetaMutations: [docMetaMutation],
        };

        return docMetaSnapshotEvent;
    }

    function createFutureUUID() {
        TestingTime.forward(5000);
        return UUIDs.create();
    }

    it('basic duplicate suppression', async function() {
        const docMetaSnapshotEvent = createDocMetaSnapshotEvent();

        await deduplicatedListener(docMetaSnapshotEvent);
        await deduplicatedListener(docMetaSnapshotEvent);

        waitForExpect(() => {
            assert.equal(emitted.length, 1);
        });
    });

    it("Two 'created' (with differing times)", async function() {
        const docMetaSnapshotEvent = createDocMetaSnapshotEvent();

        await deduplicatedListener(docMetaSnapshotEvent);

        docMeta.docInfo.uuid = createFutureUUID();

        await deduplicatedListener(docMetaSnapshotEvent);

        await waitForExpect(() => {
            assert.equal(emitted.length, 2);
        });
    });

    it('One created, then one updated.', async function() {
        await deduplicatedListener(createDocMetaSnapshotEvent('created'));

        docMeta.docInfo.uuid = createFutureUUID();

        await deduplicatedListener(createDocMetaSnapshotEvent('updated'));

        await waitForExpect(() => {
            assert.equal(emitted.length, 2);
        });
    });

    it('Two updated.', async function() {
        await deduplicatedListener(createDocMetaSnapshotEvent('updated'));

        docMeta.docInfo.uuid = createFutureUUID();

        await deduplicatedListener(createDocMetaSnapshotEvent('updated'));

        await waitForExpect(() => {
            assert.equal(emitted.length, 2);
        });
    });

    it('Created, then deleted, then created', async function() {
        await deduplicatedListener(createDocMetaSnapshotEvent('created'));

        docMeta.docInfo.uuid = createFutureUUID();

        await deduplicatedListener(createDocMetaSnapshotEvent('deleted'));

        docMeta.docInfo.uuid = createFutureUUID();

        await deduplicatedListener(createDocMetaSnapshotEvent('created'));

        await waitForExpect(() => {
            assert.equal(emitted.length, 3);
        });
    });
});
