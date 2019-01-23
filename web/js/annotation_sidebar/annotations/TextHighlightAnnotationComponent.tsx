import * as React from 'react';
import { AnnotationTypes } from '../../metadata/AnnotationTypes';
import { DocAnnotation } from '../DocAnnotation';
import { Optional } from '../../util/ts/Optional';
import { AnnotationControlBar } from '../AnnotationControlBar';
import { ChildAnnotationSection } from '../child_annotations/ChildAnnotationSection';
import { IStyleMap } from '../../react/IStyleMap';

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class TextHighlightAnnotationComponent extends React.Component<
    IProps,
    IState
> {
    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};
    }

    public render() {
        const { annotation } = this.props;

        const attrType = AnnotationTypes.toDataAttribute(
            annotation.annotationType
        );

        const html = Optional.of(annotation.html).getOrElse('');

        const key = 'text-highlight-' + annotation.id;

        return (
            <div className="m-0 mb-2">
                <div
                    key={key}
                    data-annotation-id={annotation.id}
                    data-annotation-type={attrType}
                    data-annotation-color={annotation.color}
                    className={attrType}
                >
                    <blockquote className="p-1">
                        <span dangerouslySetInnerHTML={{ __html: html }} />
                    </blockquote>

                    <AnnotationControlBar annotation={annotation} />

                    <div className="comments">
                        <ChildAnnotationSection
                            children={annotation.children}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
interface IProps {
    annotation: DocAnnotation;
}

interface IState {}
