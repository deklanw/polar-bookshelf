import { Tokens } from './Tokens';
import { Preconditions } from '../Preconditions';
import { Strings } from './Strings';

export class Attributes {
    /**
     *
     * @deprecated
     */
    public static dataToMap(element: HTMLElement) {
        return Attributes.dataToPrimitiveMap(element);
    }

    /**
     * Extract data attributes on an element as a map.
     *
     */
    public static dataToPrimitiveMap(element: HTMLElement) {
        const result: { [key: string]: string | number | boolean } = {};

        Preconditions.assertNotNull(element, 'element');

        Array.from(element.attributes).forEach(attr => {
            if (attr.name.startsWith('data-')) {
                let key = attr.name;
                key = key.replace('data-', '');
                key = Tokens.hyphenToCamelCase(key);
                result[key] = Strings.toPrimitive(attr.value);
            }
        });

        return result;
    }

    /**
     * Extract data attributes on an element as a map.
     *
     */
    public static dataToStringMap(element: HTMLElement) {
        const result: { [key: string]: string } = {};

        Preconditions.assertNotNull(element, 'element');

        Array.from(element.attributes).forEach(attr => {
            if (attr.name.startsWith('data-')) {
                let key = attr.name;
                key = key.replace('data-', '');
                key = Tokens.hyphenToCamelCase(key);
                result[key] = attr.value;
            }
        });

        return result;
    }
}
