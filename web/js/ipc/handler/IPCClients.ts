import { IPCClient } from './IPCClient';
import { ElectronIPCPipe } from './ElectronIPCPipe';
import { ElectronRendererPipe } from '../pipes/ElectronRendererPipe';
import { ElectronRenderToRendererPipe } from '../pipes/ElectronRenderToRendererPipe';
import { BrowserWindowReference } from '../../ui/dialog_window/BrowserWindowReference';
import { ElectronMainToBrowserWindowPipe } from '../pipes/ElectronMainToBrowserWindowPipe';
import { ElectronRendererContext } from './ElectronContext';

export class IPCClients {
    public static rendererProcess() {
        return new IPCClient(new ElectronIPCPipe(new ElectronRendererPipe()));
    }

    public static fromMainToRenderer(browserWindow: Electron.BrowserWindow) {
        const electronMainToBrowserWindowPipe = new ElectronMainToBrowserWindowPipe(
            browserWindow
        );
        const electronIPCPipe = new ElectronIPCPipe(
            electronMainToBrowserWindowPipe
        );

        const targetContext = new ElectronRendererContext(
            new BrowserWindowReference(browserWindow.id)
        );
        return new IPCClient(electronIPCPipe, targetContext);
    }

    public static fromRendererToRenderer(
        windowReference: BrowserWindowReference
    ) {
        const electronRenderToRendererPipe = new ElectronRenderToRendererPipe(
            windowReference
        );
        const electronIPCPipe = new ElectronIPCPipe(
            electronRenderToRendererPipe
        );

        const targetContext = new ElectronRendererContext(windowReference);
        return new IPCClient(electronIPCPipe, targetContext);
    }
}
