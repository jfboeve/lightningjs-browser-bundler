import Lightning from '@lightningjs/core';

import HelloWorld from './HelloWorld.js';

export default class App extends Lightning.Application {
    static _template() {
        return {
            HelloWorld: {type: HelloWorld}
        }
    }
}