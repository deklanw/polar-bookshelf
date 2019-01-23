import { AnnotationEvent } from './AnnotationEvent';

export type AnnotationEventListener = (
    annotationEvent: AnnotationEvent
) => void;
