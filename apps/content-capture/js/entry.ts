import { ContentCaptureApp } from '../../../web/js/capture/renderer/ContentCaptureApp';
import { Logger } from '../../../web/js/logger/Logger';
import { Logging } from '../../../web/js/logger/Logging';

const log = Logger.create();

async function start() {
    await Logging.init();

    const contentCaptureApp = new ContentCaptureApp();
    await contentCaptureApp.start();
}

start().catch(err => log.error('Could not start app: ', err));
