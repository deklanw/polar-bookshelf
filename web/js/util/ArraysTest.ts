import { Arrays } from './Arrays';

import { assert } from 'chai';
import { assertJSON } from '../test/Assertions';

describe('Arrays', function() {
    describe('toDict', function() {
        it('pass it an array', function() {
            assertJSON(Arrays.toDict(['hello']), { '0': 'hello' });
        });

        it('already a dictionary', function() {
            const expected = {
                hello: 'world',
            };
            assertJSON({ hello: 'world' }, expected);
        });

        it('failure', function() {
            assert.throws(() => Arrays.toDict(101));
        });
    });
});
