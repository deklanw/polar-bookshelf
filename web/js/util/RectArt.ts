/**
 * Draw ascii art rects for visualization.
 */
import { TextArray } from './TextArray';
import { Rect } from '../Rect';

export class RectArt {
    private readonly width: number;
    private readonly height: number;

    private readonly textArray: TextArray;

    /**
     *
     * @param width {number}
     * @param height {number}
     */
    constructor(width: number, height: number) {
        // we need a buffer of one so that we can position items at the ZERO
        // index of the x and y axis.
        this.textArray = new TextArray(width + 1, height + 1);

        /**
         * @type {number}
         */
        this.width = width;

        /**
         * @type {number}
         */
        this.height = height;
    }

    public drawHorizontalLine(xOrigin: number, yAxis: number, width: number) {
        for (let idx = 0; idx < width; ++idx) {
            this.textArray.write(xOrigin + idx, yAxis, '-');
        }
    }

    public drawVerticalLine(xAxis: number, yOrigin: number, height: number) {
        for (let idx = 0; idx < height; ++idx) {
            this.textArray.write(xAxis, yOrigin + idx, '|');
        }
    }

    public write(x: number, y: number, val: string) {
        this.textArray.write(x, y, val);
    }

    public toTextArray() {
        return this.textArray;
    }

    public toString() {
        return this.textArray.toString();
    }

    /**
     *
     * @param rect {Rect}
     * @return {RectArt}
     */
    public static createFromRect(rect: Rect) {
        const rectArt = new RectArt(
            rect.left + rect.width,
            rect.top + rect.height
        );

        rectArt.drawHorizontalLine(rect.left, rect.top, rect.width);
        rectArt.drawHorizontalLine(rect.left, rect.bottom - 1, rect.width);

        rectArt.drawVerticalLine(rect.left, rect.top, rect.height);
        rectArt.drawVerticalLine(rect.right, rect.top, rect.height);

        rectArt.write(rect.left, rect.top, '+');
        rectArt.write(rect.left, rect.bottom - 1, '+');
        rectArt.write(rect.right, rect.top, '+');
        rectArt.write(rect.right, rect.bottom - 1, '+');

        return rectArt;
    }

    /**
     * Create a merged display of all the given rects.
     *
     * @param rects {Array<Rect>}
     * @return {TextArray}
     */
    public static formatRects(rects: Rect[]): TextArray {
        const rectArts = rects.map(RectArt.createFromRect);

        const rectTextArrays = rectArts.map(current => current.toTextArray());

        const width = Math.max(...rectTextArrays.map(current => current.width));
        const height = Math.max(
            ...rectTextArrays.map(current => current.height)
        );

        const target = new TextArray(width, height);

        rectArts.forEach(current => {
            target.merge(current.toTextArray());
        });

        return target;
    }
}
