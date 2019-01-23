import { Logger } from '../../../../logger/Logger';

const log = Logger.create();
/**
 * Handles callbacks from JSON schema form as the form data is changed.
 */
export class FormHandler {
    public onChange(data: any): boolean {
        log.info('onChange: ', data);
        return true;
    }

    public onSubmit(data: any): boolean {
        log.info('onSubmit: ', data);
        return true;
    }

    public onError(data: any): boolean {
        log.info('onError: ', data);
        return true;
    }
}
