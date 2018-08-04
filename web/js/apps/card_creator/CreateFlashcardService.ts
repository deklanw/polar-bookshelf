import {ElectronMainReadablePipe} from '../../ipc/pipes/ElectronMainReadablePipe';
import {ElectronIPCPipe} from '../../ipc/handler/ElectronIPCPipe';
import {IPCRegistry} from '../../ipc/handler/IPCRegistry';
import {IPCEngine} from '../../ipc/handler/IPCEngine';
import {CreateFlashcardForm} from './elements/schemaform/CreateFlashcardForm';
import {CreateFlashcardHandler} from './handlers/CreateFlashcardHandler';

export class CreateFlashcardService {

    private readonly createFlashcardForm: CreateFlashcardForm;

    constructor(createFlashcardForm: CreateFlashcardForm) {
        this.createFlashcardForm = createFlashcardForm;
    }

    async start(): Promise<void> {

        let mainReadablePipe = new ElectronMainReadablePipe();
        let ipcPipe = new ElectronIPCPipe(mainReadablePipe);

        let ipcRegistry = new IPCRegistry();

        ipcRegistry.registerPath('/create-flashcard/api/create', new CreateFlashcardHandler(this.createFlashcardForm));

        let ipcEngine = new IPCEngine(ipcPipe, ipcRegistry);

        ipcEngine.start();

    }

}