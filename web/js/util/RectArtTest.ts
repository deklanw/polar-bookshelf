import { assert } from 'chai';
import { assertJSON } from '../test/Assertions';

import { Rect } from '../Rect';
import { Rects } from '../Rects';

import { RectArt } from './RectArt';
import { TextArray } from './TextArray';

describe('RectArt', function() {
    it('Basic rect', function() {
        const rect = Rects.createFromBasicRect({
            left: 5,
            top: 5,
            width: 10,
            height: 10,
        });

        const expected =
            '                \n' +
            '                \n' +
            '                \n' +
            '                \n' +
            '                \n' +
            '     +---------+\n' +
            '     |         |\n' +
            '     |         |\n' +
            '     |         |\n' +
            '     |         |\n' +
            '     |         |\n' +
            '     |         |\n' +
            '     |         |\n' +
            '     |         |\n' +
            '     +---------+\n' +
            '                \n';
        assertJSON(RectArt.createFromRect(rect).toString(), expected);
    });

    it('Test merging two', function() {
        const rect0 = Rects.createFromBasicRect({
            left: 5,
            top: 5,
            width: 10,
            height: 10,
        });

        const rect1 = Rects.createFromBasicRect({
            left: 10,
            top: 10,
            width: 20,
            height: 20,
        });

        const expected =
            '                               \n' +
            '                               \n' +
            '                               \n' +
            '                               \n' +
            '                               \n' +
            '     +---------+               \n' +
            '     |         |               \n' +
            '     |         |               \n' +
            '     |         |               \n' +
            '     |         |               \n' +
            '     |    +-------------------+\n' +
            '     |    |    |              |\n' +
            '     |    |    |              |\n' +
            '     |    |    |              |\n' +
            '     +----|----+              |\n' +
            '          |                   |\n' +
            '          |                   |\n' +
            '          |                   |\n' +
            '          |                   |\n' +
            '          |                   |\n' +
            '          |                   |\n' +
            '          |                   |\n' +
            '          |                   |\n' +
            '          |                   |\n' +
            '          |                   |\n' +
            '          |                   |\n' +
            '          |                   |\n' +
            '          |                   |\n' +
            '          |                   |\n' +
            '          +-------------------+\n' +
            '                               \n';

        const textArray = RectArt.formatRects([rect0, rect1]);

        // assert.equal(textArray.width, 15);
        assertJSON(textArray.toString(), expected);
    });
});
