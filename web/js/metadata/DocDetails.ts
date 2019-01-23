import { DocDetail, UpdatableDocDetails } from './DocDetail';
import { isPresent } from '../Preconditions';
import { Logger } from '../logger/Logger';
import { DocInfo } from './DocInfo';

const log = Logger.create();

export class DocDetails {
    public static merge(
        docInfo: DocInfo,
        docDetail?: DocDetail
    ): UpdatableDocDetails | undefined {
        // we basically now need to 'gift' additional fields to the doc model
        // here including title, filename, etc.
        if (docDetail !== undefined) {
            log.debug('Merging docDetail: ', docDetail);

            const targetDocDetails: UpdatableDocDetails = docInfo;

            const typedKeys: Array<keyof UpdatableDocDetails> = [
                'title',
                'subtitle',
                'description',
                'url',
                'filename',
            ];

            const sourceDocDetails: UpdatableDocDetails = docDetail;

            typedKeys.forEach(typedKey => {
                if (
                    !isPresent(targetDocDetails[typedKey]) &&
                    isPresent(sourceDocDetails[typedKey])
                ) {
                    const newValue = sourceDocDetails[typedKey];
                    log.debug(`Setting ${typedKey} to ${newValue}`);
                    targetDocDetails[typedKey] = newValue;
                }
            });

            return targetDocDetails;
        } else {
            log.warn('No docDetail to merge');
        }

        return undefined;
    }
}
