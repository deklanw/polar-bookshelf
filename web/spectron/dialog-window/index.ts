import {
    SpectronMain,
    SpectronMainOptions,
    WindowFactory,
} from '../../js/test/SpectronMain';
import {
    DialogWindow,
    DialogWindowOptions,
    Resource,
    ResourceType,
} from '../../js/ui/dialog_window/DialogWindow';

const windowFactory: WindowFactory = async () => {
    const resource = new Resource(ResourceType.FILE, __dirname + '/app.html');
    const dialogWindow = await DialogWindow.create(
        new DialogWindowOptions(resource)
    );
    // dialogWindow.window.webContents.toggleDevTools();
    return dialogWindow.window;
};

SpectronMain.run(async () => {}, { windowFactory });
