import { Logger } from '../../logger/Logger';
import { ParentWindowRegistry } from './ParentWindowRegistry';
import { IPCEngine } from '../../ipc/handler/IPCEngine';
import { IPCRegistry } from '../../ipc/handler/IPCRegistry';
import { ElectronIPCPipe } from '../../ipc/handler/ElectronIPCPipe';
import { ElectronMainReadablePipe } from '../../ipc/pipes/ElectronMainReadablePipe';
import { GetParentWindowHandler } from './handlers/GetParentWindowHandler';
import { CreateWindowHandler } from './handlers/CreateWindowHandler';
import { HideWindowHandler } from './handlers/HideWindowHandler';
import { ShowWindowHandler } from './handlers/ShowWindowHandler';

const log = Logger.create();

/**
 *
 * Service that runs in the main process that responds to requests to create
 * dialog boxes hosting new apps.
 *
 * @MainContext
 */
export class DialogWindowService {
    private readonly parentWindowRegistry: ParentWindowRegistry = new ParentWindowRegistry();

    public async start(): Promise<void> {
        const mainReadablePipe = new ElectronMainReadablePipe();
        const ipcPipe = new ElectronIPCPipe(mainReadablePipe);

        const ipcRegistry = new IPCRegistry();

        ipcRegistry.registerPath(
            '/api/dialog-window-service/get-parent',
            new GetParentWindowHandler(this.parentWindowRegistry)
        );

        ipcRegistry.registerPath(
            '/api/dialog-window-service/create',
            new CreateWindowHandler(this.parentWindowRegistry)
        );

        ipcRegistry.registerPath(
            '/api/dialog-window-service/hide',
            new HideWindowHandler()
        );
        ipcRegistry.registerPath(
            '/api/dialog-window-service/show',
            new ShowWindowHandler()
        );

        const ipcEngine = new IPCEngine(ipcPipe, ipcRegistry);

        ipcEngine.start();
    }
}
