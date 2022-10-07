import {
  compress,
  decompress,
  template,
} from './Bundler.js';
import ViewCompiler from './ViewCompiler';

const isEmpty = (obj) => {
    for(let prop in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    return JSON.stringify(obj) === JSON.stringify({});
}


const BundleManager = {
    bundle: {},
    viewport: undefined,
    compiler: new ViewCompiler(),
    autoUpdateHash: false,
    attachViewport() {
        this.viewport = view;
        if(!isEmpty(this.bundle)) {
            this.loadViewport();
        }
    },
    loadViewport() {
        if(this.viewport === undefined) {
            return;
        }
        this.compiler.compile(this.bundle)
            .then((response) => {
                this.viewport.loadURL(response);
            });
    },
    getSource(fileName) {
        return this.bundle.scripts[fileName].code;
    },
    setSource(fileName, source) {
        if(this.bundle.scripts[fileName].code !== source) {
            this.bundle.scripts[fileName].code = source;
            this.loadViewport();
            this.updateHash();
        }
    },
    updateHash() {
        if(this.autoUpdateHash) {
            window.location.hash = compress(this.bundle);
        }
    },
    async create() {
        return template(type);
    },
    async load(hash = '') {
        if(!hash.length) {
            this.bundle = await this.create();
            this.updateHash();
        }
        else {
            this.bundle = decompress(hash);
        }
        return this.bundle;
    }
}

export default BundleManager;