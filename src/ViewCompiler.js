import CodeBlob from './CodeBlob.js';

const getDependencies = (code) => {
    const reg = /import(?:[\s*]([\w*{}\n\r\t, ]+)[\s*]from)?[\s*](?:["'](.*[\w]+)["'])?/g;
    const result = [];
    let match;
    do {
        match = reg.exec(code)
        if(match) {
            result.push(match[2]);
        }
    } while(match);
   
    return result;
}

const checkDependencies = (target, dependencies) => {
    for(let i = 0; i < dependencies.length; i++) {
        if(dependencies[i].indexOf(target) > -1) {
            return i;
        }
    }
    return -1;
}

const sortDependencies = (scripts) => {
    return scripts.sort((a, b) => {
        const test = checkDependencies(b.file, a.dependencies);
        if(test < 0) {
            return -1;
        }
        else if(test > 0) {
            return 1;
        }
        return 0;
    });
}

const clearBlobs = (map) => {
    for(let [value, key] in map) {
        value.dispose();
        map.delete(key);
    }
}

export const compile = (bundle, storage) => {
    if(storage) {
        clearBlobs(storage);
    }
    else {
        storage = new Map();
    }

    let imports = {...bundle.dependencies};
    let scripts = [];
    
    //normalize dependencies
    for(let key in bundle.scripts) {
        const script = bundle.scripts[key];
        script.dependencies = getDependencies(script.code);
        scripts.push(script);
    }

    //sort dependencies
    scripts = sortDependencies(scripts);

    scripts.forEach(({dependencies, code, file}) => {
        dependencies.forEach((dependency) => {
            const target = /[^/]*$/.exec(dependency)[0];
            if(storage.has(target)) {
                code = code.replace(dependency, storage.get(target).url);
            }
        });
        storage.set(file, new CodeBlob([code], {type: 'text/javascript'}));
    });

    const html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <style type="text/css" media="screen">body,html{margin:0px;height:100%;overflow:hidden;}canvas{width:100%;height:100%;}</style>
                <script type="importmap">
                    ${JSON.stringify({
                        imports
                    })}
                <\/script>
                <script async src="https://cdn.jsdelivr.net/npm/es-module-shims"><\/script>
                <script type="module" src=${storage.get('launch.js').url}><\/script>
            </head>
            <body>
            </body>
        </html>
    `;

    storage.set('html', new CodeBlob([html], {type: 'text/html'}));
    return storage.get('html').url;
}

export class ViewCompiler {
    constructor(config) {
        this.storage = new Map();
        this.ref = config.ref;
    }

    async compile(bundle) {
        return compile(bundle, this.storage);
    }

    clear() {
        clearBlobs(this.storage);
    }
}

export default ViewCompiler