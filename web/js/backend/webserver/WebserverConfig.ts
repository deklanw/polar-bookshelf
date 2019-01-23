import { Preconditions } from '../../Preconditions';

export class WebserverConfig implements IWebserverConfig {
    public readonly dir: string;

    public readonly port: number;

    public readonly host: string;

    /**
     * When true, use SSL. Otherwise just use HTTP.
     */
    public readonly useSSL?: boolean;

    public readonly ssl?: SSLConfig;

    constructor(dir: string, port: number) {
        this.dir = Preconditions.assertNotNull(dir, 'dir');
        this.port = Preconditions.assertNotNull(port, 'port');
        this.host = '127.0.0.1';
    }

    public static create(config: IWebserverConfig): WebserverConfig {
        const template = {
            host: '127.0.0.1',
        };

        return Object.assign(template, config);
    }
}

export interface SSLConfig {
    key: string | Buffer;
    cert: string | Buffer;
}

export interface IWebserverConfig {
    readonly dir: string;

    readonly port: number;

    readonly host: string;

    /**
     * When true, use SSL. Otherwise just use HTTP.
     */
    readonly useSSL?: boolean;

    readonly ssl?: SSLConfig;
}
