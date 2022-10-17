import {
  decompress,
  objectIsEmpty,
  template,
  updateWindowHash,
} from './Bundler';
import ViewCompiler from './ViewCompiler';

const BundleManager = function(options) {
    let {hash = '', viewport = null, bundle = {}, autoUpdateHash = false} = options;
    let scripts, dependencies;
    const viewCompiler = new ViewCompiler();

    const MapProxy = function(obj) {
        const m = new Map(obj);
        return {
            set: (k, v) => {
                generateBundle();
                m.set(k, v);
            },
            delete: (k) => {
                generateBundle();
                m.delete(k);
            },
            clear: m.clear,
            get: m.get,
            has: m.has,
            size: m.size
        }
    }
    
    const unpack = ({scripts:s = {}, dependencies:d = {}}) => {
        scripts = new MapProxy(s);
        dependencies = new MapProxy(d);
    }

    unpack(bundle);

    const clear = () => {
        hash = '';
        scripts.clear();
        dependencies.clear();
    }

    const compile = async () => {
        return viewCompiler.compile(bundle)
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
        compile();
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
        if(this.scripts.size > 0) {
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
        releaseViewport
    }
};

export default BundleManager;