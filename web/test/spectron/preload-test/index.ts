import { SpectronMain, WindowFactory } from '../../../js/test/SpectronMain';
import { BrowserWindow } from 'electron';

export const BROWSER_OPTIONS = {
    backgroundColor: '#FFF',

    // NOTE: the default width and height shouldn't be changed here as it can
    // break unit tests.

    // width: 1000,
    // height: 1000,

    webPreferences: {
        webSecurity: false,
        // can NOT be loaded from file URLs
        // preloadURL: "file:///home/burton/projects/polar-bookshelf/web/spectron/preload-test/preload.js"
        // preloadURL: "./preload.js"
        // preloadURL: "./preload.js"
    },
};

const windowFactory: WindowFactory = async () => {
    console.log('Creating custom window.');
    const mainWindow = new BrowserWindow(BROWSER_OPTIONS);
    // mainWindow.webContents.toggleDevTools();
    mainWindow.loadURL('about:blank');
    return mainWindow;
};

SpectronMain.run(
    async state => {
        state.window.loadFile(__dirname + '/app.html');

        await state.testResultWriter.write(true);
    },
    { windowFactory }
);
