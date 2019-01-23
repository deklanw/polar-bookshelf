export class ContentTypes {
    public static contentTypeToExtension(contentType: string) {
        if (contentType === 'text/html') {
            return 'html';
        } else {
            return 'dat';
        }
    }
}
