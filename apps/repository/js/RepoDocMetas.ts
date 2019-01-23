import { DocMeta } from '../../../web/js/metadata/DocMeta';
import { RepoDocMeta } from './RepoDocMeta';
import { RepoDocInfos } from './RepoDocInfos';
import { RepoAnnotations } from './RepoAnnotations';
import { Logger } from '../../../web/js/logger/Logger';
import { RepoDocInfo } from './RepoDocInfo';
import { isPresent } from '../../../web/js/Preconditions';

const log = Logger.create();

export class RepoDocMetas {
    public static isValid(repoDocMeta?: RepoDocMeta) {
        return repoDocMeta && isPresent(repoDocMeta.repoDocInfo.filename);
    }

    public static convert(
        fingerprint: string,
        docMeta?: DocMeta
    ): RepoDocMeta | undefined {
        if (!docMeta) {
            log.warn('No docMeta for file: ', fingerprint);
            return undefined;
        }

        if (!docMeta.docInfo) {
            log.warn('No docInfo for file: ', fingerprint);
            return undefined;
        }

        const repoDocInfo = RepoDocInfos.convert(docMeta.docInfo);
        const repoAnnotations = RepoAnnotations.convert(docMeta);

        return { repoDocInfo, repoAnnotations };
    }
}
