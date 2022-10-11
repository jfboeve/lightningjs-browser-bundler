import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from './lz-string.js';
import baseTemplate from './templates/base.json';
import componentTemplate from './templates/component.json';
import playgroundTemplate from './templates/playground.json';

const templates = {
    base: baseTemplate,
    component: componentTemplate,
    playground: playgroundTemplate
}

export const decompress = async (str) => {
    return JSON.parse(decompressFromEncodedURIComponent(str));
}

export const compress = async (bundle) => {
    return compressToEncodedURIComponent(JSON.stringify(bundle));
}

export const template = async (template = 'base') => {
    return templates[template];
}

export default {
    template,
    compress,
    decompress
}