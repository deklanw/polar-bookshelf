export class Tokens {
    public static hyphenToCamelCase(key: string) {
        key = key.replace(/-([a-zA-Z])/g, match => {
            return match.replace('-', '').toUpperCase();
        });

        return key;
    }
}
