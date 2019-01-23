import { assert } from 'chai';
import { assertJSON } from '../test/Assertions';
import { PagemarkRects } from './PagemarkRects';
import { Rects } from '../Rects';

describe('PagemarkRects', function() {
    describe('createFromPositionedRect', function() {
        it('basic', function() {
            const rect = Rects.createFromBasicRect({
                left: 0,
                top: 0,
                width: 800,
                height: 500,
            });

            const parentRect = Rects.createFromBasicRect({
                left: 0,
                top: 0,
                width: 800,
                height: 1000,
            });

            const expected = {
                left: 0,
                top: 0,
                width: 100,
                height: 50,
            };

            assertJSON(
                PagemarkRects.createFromPositionedRect(rect, parentRect),
                expected
            );
        });
    });
});
