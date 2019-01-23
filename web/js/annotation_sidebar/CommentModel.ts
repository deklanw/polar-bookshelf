import { DocMetaModel } from '../metadata/DocMetaModel';
import { DocMeta } from '../metadata/DocMeta';
import { AnnotationEventListener } from '../annotations/components/AnnotationEventListener';
import { PageMetas } from '../metadata/PageMetas';

export class CommentModel extends DocMetaModel {
    public registerListener(
        docMeta: DocMeta,
        annotationEventListener: AnnotationEventListener
    ) {
        PageMetas.createModel(docMeta, 'comments', annotationEventListener);
        return annotationEventListener;
    }
}
