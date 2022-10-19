import {
  decompress,
  objectIsEmpty,
  template,
} from './Bundler';
import ViewCompiler from './ViewCompiler.js';

export default class BundleManager {
    constructor(options = {}) {
        const {hash = '', viewport = null, bundle = {}, autoUpdateHash = false} = options;
        this.viewCompiler = new ViewCompiler();
        this.hash = hash;
        this.viewport = viewport;
        this.autoUpdateHash = autoUpdateHash;
        this.bundle = bundle;
        this.unpack(bundle);
    }

    clear() {
        this.hash = '';
        this.scripts.clear();
        this.dependencies.clear();
    }

    unpack({scripts = {}, dependencies = {}}) {
        this.scripts = new Map(Object.entries(scripts));
        this.dependencies = new Map(Object.entries(dependencies));
    }

    async compile() {
        const bundle = await this.packageBundle();
        return this.viewCompiler.compile(bundle)
            .then((response) => {
                if(this.viewport) {
                    this.viewport.loadURL(url);
                }
                return response;
            });
    }

    async packageBundle() {
        this.bundle.scripts = Object.fromEntries(this.scripts);
        this.bundle.dependencies = Object.fromEntries(this.dependencies);
        if(this.autoUpdateHash) {
            this.hash = await updateWindowHash(this.bundle);
        }
        return this.bundle;
    }

    loadViewport() {
        if(!this.viewport) {
            return;
        }
        this.compile();
    }

    attachViewport(viewport) {
        this.viewport = viewport;
        if(this.scripts.size > 0) {
            this.loadViewport();
        }
    }

    releaseViewport () {
        this.viewport = null;
    }

    async load(options) {
        this.clear();
        this.hash = options.hash || '';
        this.bundle = options.bundle || {};
        this.autoUpdateHash = options.autoUpdateHash || this.autoUpdateHash;
        this.viewport = options.viewport || this.viewport;
        if(this.hash.length === 0 && objectIsEmpty(this.bundle)) {
            this.bundle = await template(options.template || 'playground');
        }
        else if (this.hash.length > 0) {
            this.bundle = await decompress(this.hash);
        }
        this.unpack(this.bundle);
        return this.packageBundle();
    }
}