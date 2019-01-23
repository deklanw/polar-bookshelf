import { TextWidget } from './TextWidget';

export class SchemaUIFactory {
    public static create(): any {
        return {
            front: {
                'ui:widget': TextWidget,
            },
            back: {
                'ui:widget': TextWidget,
            },
        };
    }
}
