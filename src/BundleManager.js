import {
  decompress,
  objectIsEmpty,
  template,
  updateWindowHash,
} from './Bundler.js';
import ViewCompiler from './ViewCompiler.js';

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
        scripts,
        dependencies,
        clear,
        load,
        attachViewport,
        releaseViewport,
        compile,
        generateBundle
    }
};

export default BundleManager;