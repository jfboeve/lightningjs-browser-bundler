export default class CodeBlob {
    constructor(blobParts, options) {
        this.blob = new Blob(blobParts, options);
        this.url = URL.createObjectURL(this.blob);
    }

    dispose() {
        URL.revokeObjectURL(this.blob);
        this.url = undefined;
        this.blob = null;
    }
}