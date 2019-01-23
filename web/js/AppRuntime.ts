import { ipcMain, ipcRenderer } from 'electron';

/**
 * Used to determine if we're running in Electron or Chrome.
 */
export class AppRuntime {
    public static get(): AppRuntimeType {
        if (ipcRenderer) {
            return 'electron-renderer';
        } else if (ipcMain) {
            return 'electron-main';
        } else {
            return 'browser';
        }
    }

    public static isElectron() {
        switch (this.get()) {
            case 'electron-renderer':
                return true;

            case 'electron-main':
                return true;

            case 'browser':
                return false;
        }
    }
}

export type AppRuntimeType = 'electron-renderer' | 'electron-main' | 'browser';
