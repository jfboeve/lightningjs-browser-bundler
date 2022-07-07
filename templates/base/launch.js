import Lightning from '@lightningjs/core';

class ExampleApp extends Lightning.Application {
    static _template() {
        return {
            Label: {mount: 0.5, x: 480, y:270, text: {text: 'Hello World', fontSize: 80}}
        }
    }
}
const options = {stage: {w: 960, h: 540, clearColor: 0x00000000}};
const app = new ExampleApp(options);
document.body.appendChild(app.stage.getCanvas());