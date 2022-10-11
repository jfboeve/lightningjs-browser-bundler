import fs from 'fs-extra';

import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from './src/lz-string.js';

const bundle = fs.readFileSync(`./src/templates/playground.json`);

const compressBundle = await compressToEncodedURIComponent(JSON.stringify(bundle));
console.log('comp', compressBundle);


const decompressBundle = await decompressFromEncodedURIComponent(compressBundle);
console.log('decomp', JSON.parse(decompressBundle));

