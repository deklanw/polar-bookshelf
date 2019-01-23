import { ContentCaptureClient } from '../../js/capture/renderer/ContentCaptureClient';
import { SpectronMain } from '../../js/test/SpectronMain';

SpectronMain.run(async state => {
    const window = state.window;

    const contentCaptureClient = new ContentCaptureClient(window);

    const waitForControllerPromise = contentCaptureClient.waitForController();

    window.loadFile(__dirname + '/app.html');

    console.log('Waiting for controller startup promise...');
    await waitForControllerPromise;
    console.log('Waiting for controller startup promise...done');

    console.log('Waiting for new capture result now:');

    const captured = await contentCaptureClient.requestNewCapture();

    console.log('GOT IT!', captured);

    captured.url = '...removed...';

    await state.testResultWriter.write(captured);
});
