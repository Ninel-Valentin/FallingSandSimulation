import SimulationCanvas from "./scripts/Canvas.js";

const canvas = document.querySelector('canvas');
const rowInput = document.querySelector('input#rowsCount');
const colInput = document.querySelector('input#colsCount');
const tickTimerInput = document.querySelector('input#tickTimer');
const tileSizeInput = document.querySelector('input#tileSize');
const spawnAreaInput = document.querySelector('input#spawnAreaSize');
const sandColorMode = document.querySelector('select#sandColorMode');
const sandColorInput = document.querySelector('input#sandColorModeInput');
const canvasColorInput = document.querySelector('input#canvasColorModeInput');

const simulation = new SimulationCanvas(canvas
    , rowInput.value
    , colInput.value
    , tileSizeInput.value
    , spawnAreaInput.value
    , tickTimerInput.value
    , sandColorInput.value
    , sandColorMode.value == 'Rainbow'
    , canvasColorInput.value);
window.userData = {
    simulation
};

simulation.run();