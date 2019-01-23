import { HelloWorld } from './HelloWorld';
import * as assert from 'assert';

describe('HelloWorld', function() {
    it('Basic test, function', function() {
        const helloWorld = new HelloWorld();

        assert.equal(helloWorld.getMessage(), 'hello world');
    });
});
