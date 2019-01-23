import { SpectronMain } from '../../../js/test/SpectronMain';

async function start() {
    const mainWindow = await SpectronMain.setup();
    // mainWindow.loadURL("https://www.example.com");
    mainWindow.loadURL('file://' + __dirname + '/iframe-fuzzy-text.html');
}

start().catch(err => console.log(err));
