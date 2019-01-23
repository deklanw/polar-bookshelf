import { ipcMain } from 'electron';
import { Logger } from '../../logger/Logger';
import { BrowserWindow } from 'electron';

const log = Logger.create();

/**
 * Client for controlling the {@link ContentCaptureController}.
 */
export class ContentCaptureClient {
    public mainWindow: Electron.BrowserWindow;

    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    /**
     * Wait until the controller has started.
     *
     * @return {Promise<void>}
     */
    public async waitForController() {
        return new Promise(resolve => {
            ipcMain.once('content-capture', (event: any, message: any) => {
                if (message.type === 'started') {
                    resolve();
                }
            });
        });
    }

    public async requestNewCapture(): Promise<any> {
        const result = new Promise((resolve, reject) => {
            ipcMain.once('content-capture', (event: any, message: any) => {
                if (message.type === 'response') {
                    // we can now tell spectron what's up...

                    if (message.result) {
                        resolve(message.result);
                    } else if (message.err) {
                        reject(new Error(message.err));
                    } else {
                        log.error('Invalid message: ', message);
                        reject('Unknown message type');
                    }
                }
            });
        });

        this.mainWindow.webContents.send('content-capture', {
            type: 'request',
        });

        return result;
    }
}
