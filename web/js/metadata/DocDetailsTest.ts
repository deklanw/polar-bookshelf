import { assert } from 'chai';

import { DocInfo } from './DocInfo';
import { DocInfos } from './DocInfos';
import { DocDetail } from './DocDetail';
import { DocDetails } from './DocDetails';
import { assertJSON } from '../test/Assertions';

describe('DocDetails', function() {
    it('basic', function() {
        const docInfo = DocInfos.create('0x001', 1);

        const docDetail: DocDetail = {
            fingerprint: '0x001',
            title: 'hello world',
        };

        const actual = DocDetails.merge(docInfo, docDetail);
        assert.equal(docInfo.title, 'hello world');

        // assertJSON(, {});
    });
});
