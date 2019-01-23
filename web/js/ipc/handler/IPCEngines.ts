import { ElectronRendererPipe } from '../pipes/ElectronRendererPipe';
import { ElectronIPCPipe } from './ElectronIPCPipe';
import { IPCRegistry } from './IPCRegistry';
import { IPCEngine } from './IPCEngine';
import { ElectronMainReadablePipe } from '../pipes/ElectronMainReadablePipe';

export class IPCEngines {
    public static rendererProcess() {
        const electronPipe = new ElectronRendererPipe();
        const ipcPipe = new ElectronIPCPipe(electronPipe);

        const ipcRegistry = new IPCRegistry();

        return new IPCEngine(ipcPipe, ipcRegistry);
    }

    public static mainProcess() {
        const electronPipe = new ElectronMainReadablePipe();
        const ipcPipe = new ElectronIPCPipe(electronPipe);

        const ipcRegistry = new IPCRegistry();

        return new IPCEngine(ipcPipe, ipcRegistry);
    }
}
