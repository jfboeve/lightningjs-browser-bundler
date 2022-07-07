import baseTemplate from './templates/base.json';
import componentTemplate from './templates/component.json';

const templates = {
    base: baseTemplate,
    component: componentTemplate
}

export const bundle = async (url) => {
    const bundle = await fetch(`${url}/bundle.json`).then((r) => r.json());
    let scripts = [...new Set(bundle.scripts)];
    let dependencies = bundle.dependencies;

    if(bundle.template) {
        const sliceAt = /[^/]*$/.exec(import.meta.url).index;
        const url = import.meta.url.slice(0, sliceAt-1);
        const template = await fetch(`${url}/templates/${template}/bundle.json`).then((r) => r.json());
        dependencies = {...template.dependencies, ...bundle.dependencies};
        scripts = [...new Set([...template.scripts, ...bundle.scripts])];
    }

    scripts = await Promise.all(scripts.map(async(script) => {
        const scriptImport = await import(`${url}/${script}.js?raw`);
        return {
            file: `${script}.js`,
            code: scriptImport.default
        }
    }));

    const arrayToObject = {};
    scripts.forEach(({file, code}) => {
        arrayToObject[file] = {
            file,
            code
        }
    });

    return {
        ...bundle,
        scripts: arrayToObject,
        dependencies
    }
}

export const template = async (template = 'base') => {
    return templates[template];
}

export default {
    bundle,
    template
}