import { IXYRect } from '../util/rects/IXYRect';
import { IXYRects } from '../util/rects/IXYRects';
import { CapturedScreenshot } from './CapturedScreenshot';
import { ScreenshotRequest } from './ScreenshotRequest';
import { ClientRects } from '../util/rects/ClientRects';
import { Logger } from '../logger/Logger';
import { ElectronIPCPipe } from '../ipc/handler/ElectronIPCPipe';
import { ElectronRendererPipe } from '../ipc/pipes/ElectronRendererPipe';
import { IPCClient } from '../ipc/handler/IPCClient';
import { Screenshot } from '../metadata/Screenshot';
import { Screenshots } from '../metadata/Screenshots';
import { ImageType } from '../metadata/ImageType';

const log = Logger.create();

const ipcPipe = new ElectronIPCPipe(new ElectronRendererPipe());
const ipcClient = new IPCClient(ipcPipe);

/**
 * Create a screenshot of the display.
 *
 * @ElectronRendererContext
 */
export class CapturedScreenshots {
    /**
     * Create a screenshot and return a NativeImage of the result.
     *
     * https://github.com/electron/electron/blob/master/docs/api/native-image.md
     *
     * @param target Specify either rect or element to capture as properties.
     *
     * @return {Promise} for {NativeImage}. You can call toDateURL on the image
     *         with scaleFactor as an option.
     *
     */
    public static async capture(
        target: IXYRect | HTMLElement | ClientRect
    ): Promise<CapturedScreenshot> {
        let rect: IXYRect;

        if (target instanceof HTMLElement) {
            log.info(
                'Using HTML element to build rect from bounding client rect.'
            );

            rect = IXYRects.createFromClientRect(
                target.getBoundingClientRect()
            );
        } else if (ClientRects.instanceOf(target)) {
            rect = {
                x: target.left,
                y: target.top,
                width: target.width,
                height: target.height,
            };

            log.info('Using client rect: ', rect);
        } else if (IXYRects.instanceOf(target)) {
            log.info('Using IXYRect');
            rect = target;
        } else {
            throw new Error('Unknown target type.');
        }

        const screenshotRequest = <ScreenshotRequest>{
            rect,
        };

        log.info('Sending screenshot request: ', screenshotRequest);

        return await ipcClient.call<ScreenshotRequest, CapturedScreenshot>(
            '/screenshots/create-screenshot',
            screenshotRequest
        );
    }

    public static toScreenshot(
        capturedScreenshot: CapturedScreenshot
    ): Screenshot {
        return Screenshots.create(capturedScreenshot.dataURL, {
            width: capturedScreenshot.dimensions.width,
            height: capturedScreenshot.dimensions.height,
            type: ImageType.PNG,
        });
    }
}
