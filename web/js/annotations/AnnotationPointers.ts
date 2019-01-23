import { TriggerEvent } from '../contextmenu/TriggerEvent';
import { AnnotationPointer } from './AnnotationPointer';

export class AnnotationPointers {
    /**
     *
     */
    public static toAnnotationPointers(
        selector: string,
        triggerEvent: TriggerEvent
    ) {
        const result: AnnotationPointer[] = [];

        // should we just send this event to all the the windows?
        triggerEvent.matchingSelectors[selector].annotationDescriptors.forEach(
            annotationDescriptor => {
                const annotationPointer = new AnnotationPointer(
                    annotationDescriptor.id,
                    annotationDescriptor.pageNum
                );

                result.push(annotationPointer);
            }
        );

        return result;
    }
}
