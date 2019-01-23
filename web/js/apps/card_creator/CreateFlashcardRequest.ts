import { DocDescriptor } from '../../metadata/DocDescriptor';
import { AnnotationDescriptor } from '../../metadata/AnnotationDescriptor';

export class CreateFlashcardRequest {
    public readonly docDescriptor: DocDescriptor;

    public readonly pageNum: number;

    constructor(docDescriptor: DocDescriptor, pageNum: number) {
        this.docDescriptor = docDescriptor;
        this.pageNum = pageNum;
    }

    public static create(opts: any): CreateFlashcardRequest {
        const result = Object.create(CreateFlashcardRequest.prototype);
        Object.assign(result, opts);
        return result;
    }
}
