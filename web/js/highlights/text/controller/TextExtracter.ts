import { TextHighlightRow } from './TextHighlightRow';
import { TextRect } from '../../../metadata/TextRect';
import { Preconditions } from '../../../Preconditions';
import $ from '../../../ui/JQuery';

/**
 * Takes TextHighlightRows and then builds adjacent test runs from the data.
 */
export class TextExtracter {
    public static toTextSelections(textHighlightRows: TextHighlightRow[]) {
        const result: TextRect[] = [];

        textHighlightRows.forEach(function(textHighlightRow) {
            Preconditions.assertNotNull(
                textHighlightRow.rectElements,
                'rectElements'
            );

            textHighlightRow.rectElements.forEach(function(rectElement) {
                const textSelection = new TextRect({
                    rect: rectElement.rect,
                    text: $(rectElement.element).text(),
                });

                result.push(textSelection);
            });
        });

        return result;
    }
}
