import fs from 'fs-extra';

const parseBundle = async (template, bundle) => {
    let scripts = [...new Set(bundle.scripts)];

    scripts = await Promise.all(scripts.map(async(script) => {
        const scriptImport = fs.readFileSync(`./templates/${template}/${script}.js`, 'utf-8');
        return {
            file: `${script}.js`,
            code: scriptImport
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
        scripts: arrayToObject
    }
}

const templates = fs.readdirSync('./templates');
await Promise.all(templates.map(async (template) => {
    const bundle = fs.readFileSync(`./templates/${template}/bundle.json`);
    const parsedBundle = await parseBundle(template, JSON.parse(bundle));
    fs.writeFile(`./src/templates/${template}.json`, JSON.stringify(parsedBundle));
}))