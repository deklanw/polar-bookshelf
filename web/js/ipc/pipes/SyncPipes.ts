import BrowserWindow = Electron.BrowserWindow;
import { SyncPipe } from './SyncPipe';
import { ElectronMainToBrowserWindowPipe } from './ElectronMainToBrowserWindowPipe';
import { ElectronRendererPipe } from './ElectronRendererPipe';

export class SyncPipes {
    public static fromMainToBrowserWindow(
        browserWindow: BrowserWindow,
        name: string
    ) {
        return new SyncPipe(
            new ElectronMainToBrowserWindowPipe(browserWindow),
            'main-to-browser-window',
            name
        );
    }

    public static fromRendererToMain(name: string) {
        return new SyncPipe(new ElectronRendererPipe(), 'renderer', name);
    }
}
