import { Optional } from '../../../util/ts/Optional';

/**
 * Execute a job and optionally return additional data about how this job
 * executed.
 */
export type SyncTask = () => Promise<Optional<SyncTaskResult>>;

export interface SyncTaskResult {
    readonly message?: string;

    /**
     * True if this task has failed to sync.
     */
    readonly failed?: boolean;
}
