import Lightning from '@lightningjs/core';

import Component from './Component.js';

export default class App extends Lightning.Application {
    static _template() {
        return {
            Component: {type: Component}
        }
    }
}