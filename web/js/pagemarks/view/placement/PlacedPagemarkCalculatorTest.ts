import { PagemarkRect } from '../../../metadata/PagemarkRect';
import { Pagemarks } from '../../../metadata/Pagemarks';
import { Rects } from '../../../Rects';
import { PlacedPagemarkCalculator } from './PlacedPagemarkCalculator';
import { assertJSON } from '../../../test/Assertions';

describe('PlacedPagemarkCalculator', function() {
    describe('Placement', function() {
        it('50%', function() {
            const pagemarkRect = new PagemarkRect({
                top: 0,
                left: 0,
                width: 50,
                height: 50,
            });

            const pagemark = Pagemarks.create({ rect: pagemarkRect });

            const parentRect = Rects.createFromBasicRect({
                top: 0,
                left: 0,
                width: 800,
                height: 1000,
            });

            const pagemarkPlacementCalculator = new PlacedPagemarkCalculator();

            const placedPagemark = pagemarkPlacementCalculator.calculate(
                parentRect,
                pagemark
            );

            const expected = {
                rect: {
                    left: 0,
                    top: 0,
                    right: 400,
                    bottom: 500,
                    width: 400,
                    height: 500,
                },
            };

            assertJSON(placedPagemark, expected);
        });
    });
});
