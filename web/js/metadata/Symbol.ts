export class Symbol {
    public readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    public toJSON() {
        return this.name;
    }
}
