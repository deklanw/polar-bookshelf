const pkg: any = require('../../../package.json');

export class PackageManifest {
    public version(): string {
        return pkg.version;
    }

    public name(): string {
        return pkg.name;
    }
}
