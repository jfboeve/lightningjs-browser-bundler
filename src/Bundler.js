import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from './lz-string.js';
import baseTemplate from './templates/base.json';
import componentTemplate from './templates/component.json';
import playgroundTemplate from './templates/playground.json';

export const objectIsEmpty = (obj) => {
    for(let prop in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    return JSON.stringify(obj) === JSON.stringify({});
}

export const decompress = async (str) => {
    return JSON.parse(decompressFromEncodedURIComponent(str));
}

export const compress = async (bundle) => {
    return compressToEncodedURIComponent(JSON.stringify(bundle));
}

export const updateWindowHash = async (bundle) => {
    window.location.hash = await compress(bundle);
}

const templates = {
    base: baseTemplate,
    component: componentTemplate,
    playground: playgroundTemplate
}

export const template = async (template = 'base') => {
    return templates[template];
}

export default {
    template,
    compress,
    decompress
}