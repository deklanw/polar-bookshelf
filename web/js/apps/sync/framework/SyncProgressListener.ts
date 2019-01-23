import { SyncProgress } from './SyncProgress';

/**
 * Allows a SyncTarget to expose its progress.
 */
export type SyncProgressListener = (
    syncProgress: Readonly<SyncProgress>
) => void;
