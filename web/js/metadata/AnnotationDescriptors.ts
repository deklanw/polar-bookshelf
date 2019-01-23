import { AnnotationDescriptor } from './AnnotationDescriptor';
import { AnnotationTypes } from './AnnotationTypes';
import { Attributes } from '../util/Attributes';

export class AnnotationDescriptors {
    public static createFromElement(
        element: HTMLElement
    ): AnnotationDescriptor | undefined {
        const dataAttributes = Attributes.dataToStringMap(element);

        if (!dataAttributes.annotationType) {
            return undefined;
        }

        const annotationTypeStr = dataAttributes.annotationType
            .replace('-', '_')
            .toUpperCase();

        const annotationType = AnnotationTypes.fromString(annotationTypeStr);
        const id = dataAttributes.annotationId;
        const docFingerprint = dataAttributes.annotationDocFingerprint;
        const pageNum = parseInt(dataAttributes.annotationPageNum);

        return AnnotationDescriptor.newInstance(
            annotationType,
            id,
            docFingerprint,
            pageNum
        );
    }

    public static createFromObject(obj: any): AnnotationDescriptor {
        const result = new AnnotationDescriptor(<AnnotationDescriptor>obj);

        return Object.freeze(result);
    }
}
