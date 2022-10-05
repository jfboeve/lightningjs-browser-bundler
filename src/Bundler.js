import baseTemplate from './templates/base.json';
import componentTemplate from './templates/component.json';
import playgroundTemplate from './templates/playground.json';

const templates = {
    base: baseTemplate,
    component: componentTemplate,
    playground: playgroundTemplate
}

export const bundle = async (url) => {
    const bundle = await fetch(`${url}/bundle.json`).then((r) => r.json());
    let scripts = [...new Set(bundle.scripts)];
    let dependencies = bundle.dependencies || {};
    
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
    scripts = arrayToObject;
    if(bundle.template) {
        const bTemplate = await template(bundle.template);
        scripts = {
            ...bTemplate.scripts,
            ...scripts
        };
        dependencies = {
            ...bTemplate.dependencies,
            ...dependencies
        }
    }

    return {
        ...bundle,
        scripts,
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