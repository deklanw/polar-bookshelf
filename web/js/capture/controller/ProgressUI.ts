import { ipcRenderer } from 'electron';
import { Logger } from '../../logger/Logger';
import { Elements } from '../../util/Elements';
import { notNull } from '../../Preconditions';
import { PendingWebRequestsEvent } from '../../webrequests/PendingWebRequestsListener';

const log = Logger.create();

/**
 * @ElectronRendererContext
 */
export class ProgressUI {
    constructor() {}

    public init() {
        // listen and handle "capture-progress" IPC messages

        log.info('Listening for progress updates...');

        ipcRenderer.on(
            'capture-progress-update',
            (event: Electron.Event, progressEvent: PendingWebRequestsEvent) => {
                this.onProgressEvent(progressEvent);
            }
        );
    }

    public onProgressEvent(progressEvent: PendingWebRequestsEvent) {
        log.info('Got progress update: ', progressEvent.progress);

        this.updateProgress(progressEvent);
        this.updateLogView(progressEvent);
    }

    public updateProgress(progressEvent: PendingWebRequestsEvent) {
        const progressElement = <HTMLProgressElement>(
            document.querySelector('progress')
        );
        progressElement.value = progressEvent.progress;
    }

    public updateLogView(progressEvent: PendingWebRequestsEvent) {
        const logElement = notNull(document.querySelector('.log'));

        const lineElement = Elements.createWrapperElementHTML(
            `<div class="">${progressEvent.details.url}</div>`
        );

        logElement.appendChild(lineElement);
    }
}
