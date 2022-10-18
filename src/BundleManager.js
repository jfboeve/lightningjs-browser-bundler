import { updateWindowHash } from './Bundler';
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
        return this.viewCompiler.compile(this.generateBundle());
    }

    generateBundle() {
        this.bundle.scripts = Object.fromEntries(this.scripts);
        this.bundle.dependencies = Object.fromEntries(this.dependencies);
        if(this.autoUpdateHash) {
            updateWindowHash(this.bundle);
        }
        return this.bundle;
    }

    loadViewport() {
        if(!this.viewport) {
            return;
        }
        this.compile().then((url) => {
            viewport.loadURL(url);
        });
    }

    attachViewport(viewport) {
        this.viewport = viewport;
        if(scripts.size > 0) {
            loadViewport();
        }
    }

    releaseViewport () {
        this.viewport = null;
    }

    async load() {
        this.clear();
        this.hash = options.hash || '';
        this.bundle = options.bundle || {};
        this.autoUpdateHash = options.autoUpdateHash || autoUpdateHash;
        this.viewport = options.viewport || viewport;

        if(hash.length === 0 && objectIsEmpty(bundle)) {
            this.bundle = await template(options.template || 'playground');
        }
        else if (hash.length > 0) {
            this.bundle = await decompress(hash);
        }

        this.unpack(this.bundle);
        this.loadViewport();
        return this.generateBundle(this.bundle);
    }
}
/*
const BundleManager = function(options = {}) {
    let {hash = '', viewport = null, bundle = {}, autoUpdateHash = false} = options;
    let scripts, dependencies;
    const viewCompiler = new ViewCompiler();
    
    const unpack = ({scripts:s = {}, dependencies:d = {}}) => {
        scripts = new Map(Object.entries(s));
        dependencies = new Map(Object.entries(d));
    }

    unpack(bundle);

    const clear = () => {
        hash = '';
        scripts.clear();
        dependencies.clear();
    }

    const compile = async () => {
        return viewCompiler.compile(generateBundle())
            .then((response) => {
                return response;
            });
    }

    const generateBundle = () => {
        bundle = {
            dependencies: Object.fromEntries(dependencies), 
            scripts: Object.fromEntries(scripts)
        };
        if(autoUpdateHash) {
            updateWindowHash(bundle);
        }
        return bundle;
    }

    const loadViewport = () => {
        if(!viewport) {
            return;
        }
        compile().then((url) => {
            viewport.loadURL(url);
        });
    }

    const attachViewport = (view) => {
        viewport = view;
        if(scripts.size > 0) {
            loadViewport();
        }
    }

    const releaseViewport = () => {
        viewport = null;
    }

    const load = async (options = {}) => {
        clear();
        hash = options.hash || '';
        bundle = options.bundle || {};
        autoUpdateHash = options.autoUpdateHash || autoUpdateHash;
        viewport = options.viewport || viewport;

        if(hash.length === 0 && objectIsEmpty(bundle)) {
            bundle = await template(options.template || 'playground');
        }
        else if (hash.length > 0) {
            bundle = await decompress(hash);
        }

        unpack(bundle);
        loadViewport();
        if(autoUpdateHash) {
            updateWindowHash(bundle);
        }
        return {
            scripts,
            dependencies
        }
    }

    return {
        scripts() {
            return scripts;
        },
        dependencies() {
            return dependencies;
        },
        clear,
        load,
        attachViewport,
        releaseViewport,
        compile,
        generateBundle
    }
};

export default BundleManager;*/