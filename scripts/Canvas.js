import utils from "./utils/matrixService.js";

class SimulationCanvas {
    constructor(
        canvas,
        rows,
        cols,
        tileSize,
        spawnArea,
        tickTimer,
        sandColor,
        useRainbowSand,
        canvasColor) {

        const width = tileSize * cols
            , height = tileSize * rows;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.setAttribute('width', width);
        this.canvas.setAttribute('height', height);
        this.size = {
            width: width,
            height: height
        }

        this.tickTimer = tickTimer;
        this.rows = +rows;
        this.cols = +cols;
        this.tileSize = tileSize;
        this.spawnArea = spawnArea;

        this.sandColor = sandColor;
        this.rainbowSand = useRainbowSand;
        this.hueColor = 0;
        this.hueStep = 1;
        this.canvasColor = canvasColor;

        this.currentCells = utils.GetEmptyMatrix(this.rows, this.cols);
        this.nextCells = utils.GetEmptyMatrix(this.rows, this.cols);

        this.isDrawing = false;
        this.frameLoopRef = null;
    }

    ReinitializeValues() {
        clearTimeout(this.frameLoopRef);

        const rowInput = document.querySelector('input#rowsCount');
        const colInput = document.querySelector('input#colsCount');
        const tileSizeInput = document.querySelector('input#tileSize');
        const spawnAreaInput = document.querySelector('input#spawnAreaSize');
        const tickTimerInput = document.querySelector('input#tickTimer');
        const sandColorInput = document.querySelector('input#sandColorModeInput');
        const sandColorMode = document.querySelector('select#sandColorMode');
        const canvasColorInput = document.querySelector('input#canvasColorModeInput');

        this.spawnArea = spawnAreaInput.value;
        this.tickTimer = tickTimerInput.value;
        this.sandColor = sandColorInput.value;
        this.canvasColor = canvasColorInput.value;
        this.useRainbowSand = sandColorMode.value == 'Rainbow'

        const rows = rowInput.value
            , cols = colInput.value;
        const tileSize = tileSizeInput.value
        const width = tileSize * cols
            , height = tileSize * rows;

        const canvasSizeChanged = this.rows != rows || this.cols != cols || this.tileSize != tileSize;

        if (canvasSizeChanged) {
            this.canvas.setAttribute('width', width);
            this.canvas.setAttribute('height', height);
            this.size = {
                width: width,
                height: height
            }
            this.rows = +rows;
            this.cols = +cols;
            this.tileSize = tileSize;

            this.currentCells = utils.GetClonedMatrix(this.currentCells, this.rows, this.cols);
        }

        this.DrawScreen();
        clearInterval(this.frameLoopRef);
        this.frameLoopRef = setInterval(this.FrameLoop, this.tickTimer, this);
    }

    run() {
        this.InitializeEvents();
        this.DrawScreen();

        clearInterval(this.frameLoopRef);
        this.frameLoopRef = setInterval(this.FrameLoop, this.tickTimer, this);
    }

    Frame() {
        this.CheckForStaticCursorSpawing();
        this.CalculateNextScreen();
        this.DrawScreen();
        this.hueColor += this.hueStep;
    }

    FrameLoop(caller) {
        caller.Frame();
    }

    DrawScreen() {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++) {
                let fromX = Math.floor(j * this.tileSize),
                    fromY = Math.floor(i * this.tileSize),
                    toX = Math.floor(fromX + this.tileSize),
                    toY = Math.floor(fromY + this.tileSize);
                if (this.currentCells[i][j] > 0)
                    if (this.useRainbowSand) {
                        this.ctx.fillStyle = `hsl(${this.currentCells[i][j]},100%,50%)`;
                    }
                    else {
                        this.ctx.fillStyle = this.sandColor;
                    }
                else
                    this.ctx.fillStyle = this.canvasColor;
                this.ctx.fillRect(fromX, fromY, toX, toY);
            }
    }

    CalculateNextScreen() {
        this.nextCells = utils.GetEmptyMatrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++) {
                // If this is a grain of sand
                if (this.currentCells[i][j] > 0) {
                    // If this is part of the screen still
                    if (i < this.rows - 1) {
                        // If there is space below
                        if (this.currentCells[i + 1][j] == 0) {
                            this.nextCells[i + 1][j] = this.currentCells[i][j];
                        } else {
                            let randomFactor = Math.random() > .5 ? 1 : -1;
                            // Check left and right in random order
                            if (j + randomFactor >= 0
                                && j + randomFactor < this.cols
                                && this.currentCells[i + 1][j + randomFactor] == 0) {
                                this.nextCells[i + 1][j + randomFactor] = this.currentCells[i][j];
                            } else if (j - randomFactor >= 0
                                && j - randomFactor < this.cols
                                && this.currentCells[i + 1][j - randomFactor] == 0) {
                                this.nextCells[i + 1][j - randomFactor] = this.currentCells[i][j];
                            } else {
                                this.nextCells[i][j] = this.currentCells[i][j];
                            }
                        }
                    } else {
                        this.nextCells[i][j] = this.currentCells[i][j];
                    }
                }
            }
        this.currentCells = this.nextCells;
        this.nextCells = utils.GetEmptyMatrix(this.rows, this.cols);
    }

    CheckForStaticCursorSpawing() {
        if (this.isDrawing && this.lastCursorPosition?.y && this.lastCursorPosition?.x) {
            this.SpawnSandInArea(this.lastCursorPosition.x, this.lastCursorPosition.y, this.hueColor);
        }
    }

    SpawnSandInArea(row, col, value) {
        const range = Math.floor(this.spawnArea / 2);
        for (let i = -range; i <= range; i++)
            for (let j = -range; j <= range; j++) {
                const x = j + col
                    , y = i + row;
                // If is part of the canvas
                if (x >= 0 && x < this.cols &&
                    y >= 0 && y < this.rows) {
                    const spawnSand = this.spawnArea ? Math.random() < 0.25 : true;
                    if (spawnSand)
                        this.currentCells[x][y] = value;
                }
            }
    }

    ClearCanvas() {
        this.currentCells = utils.GetEmptyMatrix(this.rows, this.cols);
    }

    InitializeEvents() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDrawing = true;
            let cellX = e.clientX - this.canvas.offsetLeft,
                cellY = e.clientY - this.canvas.offsetTop;

            let matrixX = Math.round(cellX / this.tileSize),
                matrixY = Math.round(cellY / this.tileSize);

            this.lastCursorPosition = {
                x: matrixX,
                y: matrixY
            };
        });
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDrawing) {
                let cellX = e.clientX - this.canvas.offsetLeft,
                    cellY = e.clientY - this.canvas.offsetTop;

                let matrixX = Math.round(cellX / this.tileSize),
                    matrixY = Math.round(cellY / this.tileSize);

                this.lastCursorPosition = {
                    x: matrixX,
                    y: matrixY
                };
                this.SpawnSandInArea(matrixX, matrixY, this.hueColor);
            }
        });
        this.canvas.addEventListener('mouseup', (e) => {
            this.isDrawing = false;
        });
        this.canvas.addEventListener('mouseleave', (e) => {
            this.isDrawing = false;
        });
        document.querySelector('input#saveValues').addEventListener('click', () => {
            window.userData.simulation.ReinitializeValues();
        });
        document.querySelector('input#clearCanvas').addEventListener('click', () => {
            window.userData.simulation.ClearCanvas();
        });
    }
}

export default SimulationCanvas;