import { IPCMessage } from './IPCMessage';
import { Objects } from '../../util/Objects';
import { IPCError } from './IPCError';

const assert = require('assert');

describe('IPCMessage', function() {
    class Name {
        public readonly first: string;
        public readonly last: string;

        constructor(first: string, last: string) {
            this.first = first;
            this.last = last;
        }

        public static create(obj: any): Name {
            return Objects.createInstance(Name.prototype, obj);
        }
    }

    let name = new Name('Alice', 'Smith');
    let ipcMessage = new IPCMessage('name', name);

    it('Test constructor function to re-create object properly', function() {
        assert.equal(name instanceof Name, true);

        const obj = Object.assign({}, ipcMessage);

        console.log('Trying to create IPC message from basic object: ', obj);

        ipcMessage = IPCMessage.create(obj, Name.create);

        name = ipcMessage.value;

        assert.equal(name instanceof Name, true);
        assert.equal(name.first, 'Alice');
        assert.equal(name.last, 'Smith');
    });

    it('Test constructor function without constructor', function() {
        const obj = Object.assign({}, ipcMessage);

        console.log('Trying to create IPC message from basic object: ', obj);

        ipcMessage = IPCMessage.create(obj);

        name = ipcMessage.value;

        assert.equal(name instanceof Name, true);
        assert.equal(name.first, 'Alice');
        assert.equal(name.last, 'Smith');
    });

    it('Create an IPC message from an error IPC message', function() {
        let errMessage: IPCMessage<any> = IPCMessage.createError(
            'fake',
            IPCError.create(new Error('Fake error'))
        );

        errMessage = IPCMessage.create(errMessage);

        assert.throws(() => {
            errMessage.value();
        });

        assert.throws(() => {
            errMessage.value;
        });
    });
});
