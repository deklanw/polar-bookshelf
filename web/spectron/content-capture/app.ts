import { ContentCaptureApp } from '../../js/capture/renderer/ContentCaptureApp';
import { SpectronRenderer } from '../../js/test/SpectronRenderer';

SpectronRenderer.run(async () => {
    const contentCaptureApp = new ContentCaptureApp();

    await contentCaptureApp.start();

    console.log('App loaded now!!');
});
