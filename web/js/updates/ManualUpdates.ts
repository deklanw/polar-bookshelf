import { dialog } from 'electron';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import { ProgressInfo } from 'builder-util-runtime';
import { Logger } from '../logger/Logger';

import process from 'process';
import { Broadcasters } from '../ipc/Broadcasters';
import { AppAnalytics } from '../ga/AppAnalytics';
import { GA } from '../ga/GA';
import { Version } from '../util/Version';

// borrowed from here and ported to typescript:
//
// https://github.com/electron-userland/electron-builder/blob/docs/encapsulated%20manual%20update%20via%20menu.js

const log = Logger.create();

autoUpdater.autoDownload = false;

// this is so that we can
autoUpdater.allowPrerelease =
    process.env.POLAR_AUTO_UPDATER_ALLOW_PRERELEASE === 'true';

log.info(
    'Allowing pre-releases for auto-updates: ' + autoUpdater.allowPrerelease
);

export class ManualUpdates {
    // export this to MenuItem click callback
    public static checkForUpdates(menuItem: Electron.MenuItem) {
        updater = menuItem;
        updater.enabled = false;
        autoUpdater
            .checkForUpdates()
            .catch(err => log.error('Error handling updates: ' + err));
    }
}

let updater: Electron.MenuItem | null;

autoUpdater.on('error', error => {
    dialog.showErrorBox(
        'Error: ',
        error == null ? 'unknown' : (error.stack || error).toString()
    );
});

autoUpdater.on('update-available', (info: UpdateInfo) => {
    log.info('Found new update: ', info);

    let message = 'Found updates, do you want update now?';

    if (info && info.version) {
        const fromVersion = Version.get();
        const toVersion = info.version;
        message = `Found updates, do you want update from ${fromVersion} to ${toVersion} now?`;
    }

    const options = {
        type: 'info',
        title: 'Found Updates',
        message,
        buttons: ['Yes', 'No'],
    };

    dialog.showMessageBox(options, buttonIndex => {
        if (buttonIndex === 0) {
            autoUpdater
                .downloadUpdate()
                .then(async () => {
                    try {
                        await GA.getInstance().event(
                            'updates',
                            'manual-update'
                        );
                        await GA.getInstance().event(
                            'updates',
                            'manual-update-' + Version.get()
                        );
                    } catch (e) {
                        log.error('Unable to send event data: ', e);
                    }
                })
                .catch(err => log.error('Error handling updates: ' + err));
        } else {
            updater!.enabled = true;
            updater = null;
        }
    });
});

autoUpdater.on('update-not-available', () => {
    const options = {
        title: 'No Updates',
        message: 'Current version is up-to-date.',
    };

    dialog.showMessageBox(options);
    updater!.enabled = true;
    updater = null;
});

autoUpdater.on('update-downloaded', () => {
    const options = {
        title: 'Install Updates',
        message: 'Updates downloaded, application will be quit for update...',
    };

    dialog.showMessageBox(options, () => {
        setImmediate(() => autoUpdater.quitAndInstall());
    });
});

autoUpdater.on('download-progress', (progress: ProgressInfo) => {
    // ProgressBar

    // https://github.com/electron-userland/electron-builder/blob/docs/auto-update.md#event-download-progress
    // bytesPerSecond percent total transferred

    log.info(`Auto update download progress: ${progress.percent}. `, progress);

    // TODO: we're running in the main process here. We could use the IPC
    // broadcaster to send message to every renderer and have a controller
    // running there, listening for the messages on download progress updates
    // and then display the appropriate UI.

    Broadcasters.send('download-progress', progress);
});
