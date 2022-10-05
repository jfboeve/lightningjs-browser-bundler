import App from './App.js';

const options = {stage: {w: 960, h: 540, clearColor: 0x00000000}};
const app = new App(options);
document.body.appendChild(app.stage.getCanvas());