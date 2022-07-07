# Lightning Bundler

With Lightning-Bundler you can bundle a small project in the browser.

## Bundler

The bundler can map a bundle with a targeted folder, provided that folder contains the following file;

```
//folder
    --bundle.json
    --launch.js
```

Because in the browser you don't have access to some functionalities which you do browser you have to specify file names manualy in order to use them.

```json
{
    "dependencies": {
        "@lightningjs/core": "https://cdn.skypack.dev/@lightningjs/core"
    },
    "scripts": ["launch", "App", "Component"],
    "sample": "Component",
    "template": "component" //optional
}
```

### dependencies
This is an object of external npm pacakages, we recommend using skypack.dev to fetch you custom npm package.

### scripts
These are local JavaScript files which are located in the same folder as the bundle.json

### sample
This specifies which script you want to present as sample.

### template
You can also merge your bundle onto a template bundle provided by this package.


#### Usage

```js
import Bundler from '@lightningjs/browser-bundler'

const bundle = await Bundler.bundle('./example');
```

The `bundle` function will return a bundle object you can use to build a view with the ViewCompiler.

You can also fetch a template provided by the package by using;

```js
import Bundler from '@lightningjs/browser-bundler'

const template = await Bundler.template('component');
```

## ViewCompiler
With the view compiler you can use the bundle and create it into a html page.

#### Usage

```js
import ViewCompiler from '@lightningjs/browser-bundler'

const view = new ViewCompiler();
const html = await view.compile(bundle);
```