export class Electron {
    public static isElectron() {
        const userAgent = navigator.userAgent.toLowerCase();
        return userAgent.indexOf(' electron/') !== -1;
    }
}
