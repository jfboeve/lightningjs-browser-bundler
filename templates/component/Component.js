import Lightning from '@lightningjs/core';

export default class Component extends Lightning.Component {
    static _template() {
        return {
            Label: {mount: 0.5, x: 480, y:270, text: {text: 'Hello World', fontSize: 80}}
        }
    }
}