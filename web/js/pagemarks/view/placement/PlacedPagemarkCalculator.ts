import { Axis, Rect } from '../../../Rect';
import { Pagemark } from '../../../metadata/Pagemark';
import { PagemarkRects } from '../../../metadata/PagemarkRects';
import { Preconditions } from '../../../Preconditions';
import { Rects } from '../../../Rects';
import { PlacedPagemark } from './PlacedPagemark';
import { Line } from '../../../util/Line';

export class PlacedPagemarkCalculator {
    /**
     * Compute a Rect for rendering the pagemarkRect onto the parentRect.
     *
     */
    public calculate(parentRect: Rect, pagemark: Pagemark) {
        let pagemarkRect = pagemark.rect;

        if (!pagemarkRect) {
            pagemarkRect = PagemarkRects.createDefault(pagemark);
        }

        Preconditions.assertNotNull(parentRect, 'parentRect');
        Preconditions.assertNotNull(pagemarkRect, 'pagemarkRect');

        const fractionalRect = pagemarkRect.toFractionalRect();

        const resultX = this._scaleAxis(parentRect, fractionalRect, 'x');
        const resultY = this._scaleAxis(parentRect, fractionalRect, 'y');

        const rect = Rects.createFromLines(resultX, resultY);

        return new PlacedPagemark({ rect });
    }

    /**
     *
     */
    public _scaleAxis(parentRect: Rect, fractionalRect: Rect, axis: Axis) {
        return this._scaleLine(
            parentRect.toLine(axis),
            fractionalRect.toLine(axis)
        );
    }

    /**
     *
     */
    public _scaleLine(parentLine: Line, fractionalLine: Line) {
        const start = parentLine.start * fractionalLine.start;
        const end = parentLine.end * fractionalLine.end;
        return new Line(start, end, parentLine.axis);
    }
}
