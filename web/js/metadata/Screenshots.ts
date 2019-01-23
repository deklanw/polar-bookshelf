import { Screenshot } from './Screenshot';
import { Hashcodes } from '../Hashcodes';
import { ImageOpts } from './Image';
import { ISODateTimeStrings } from './ISODateTimeStrings';

export class Screenshots {
    public static create(src: string, opts: ImageOpts, id?: string) {
        if (id === undefined) {
            id = Hashcodes.createRandomID();
        }

        return new Screenshot({
            id,
            created: ISODateTimeStrings.create(),
            src,
            width: opts.width,
            height: opts.height,
            type: opts.type,
            rel: opts.rel,
        });
    }

    public static parseURI(value: string): ScreenshotURI | undefined {
        if (!value.startsWith('screenshot:')) {
            return undefined;
        }

        return {
            value,
            id: value.split(':')[1],
        };
    }
}

export interface ScreenshotURI {
    value: string;
    id: string;
}
