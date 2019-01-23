/**
 * Simple util that takes command line arguments like --foo=bar and parses them
 * into a map.
 */
import { Strings } from './Strings';

export class ArgsParser {
    /**
     * Convert an argument name --enable-foo in a --enable-foo=bar arg to enableFoo
     *
     * @private
     */
    public static _toKey(key: string) {
        key = key.replace(/^--/, '');
        key = key.replace(/-([a-zA-Z])/g, match => {
            return match.replace('-', '').toUpperCase();
        });

        return key;
    }

    public static parse(argv: any[]) {
        const result: { [name: string]: any } = {};

        argv.forEach(arg => {
            if (/^--[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+/.test(arg)) {
                const _split = arg.split('=');
                const key = ArgsParser._toKey(_split[0]);
                const value = Strings.toPrimitive(_split[1]);
                result[key] = value;
            }
        });

        return result;
    }
}
