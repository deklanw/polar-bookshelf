/**
 *
 */
export class TimeoutEvent {
    /**
     * The total pending number of timeouts.
     */
    public pending: number = 0;

    /**
     * The timeout for this registered callback.
     */
    public timeout: number = 0;

    constructor(opts: any) {
        Object.assign(this, opts);
    }
}
