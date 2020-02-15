// Algorithm Variables
let searchAlgo;
let startAlgo = false;
let source, target, blocks;
let savedBlocks;

// Grid Variables
let grid;
let rows = 75;
let cols = 75;
let wallRate = 0.3;

// Interactivity
let algoBtn;
let resetBtn;
let wallRateSlider;
let wallRateP;
let drawWallState = true;
let drawWallTypeBtn;
let saveBtn, loadBtn;

// Moving Source or Target Block
let moveX, moveY;
let moveBlock;



// P5 Functions
function setup() {
    createCanvas(800, 800);

    // Interactivity
    initInteractive();
    

    // Create Grid System
    grid = new Grid(rows, cols);

    // Set Source and Target
    source = createVector(0, 0);
    target = createVector(20, 20);
    // target = createVector(cols - 1, rows - 1);
    
    // Create Blocks Array
    initBlocks();

    // Create Search Algorithm
    searchAlgo = new BreadthFirstSearch();
}

function draw() {
    background(0);

    stroke(255, 255, 255, 50);
    grid.drawGrid();
    grid.drawBlocks(blocks);

    // Run the Algorithm
    if (startAlgo) {
        // Step by Step
        const path = searchAlgo.step_BFS(blocks, blocks[source.x][source.y]);

        if (searchAlgo.done) {

            // Draw Path
            if (path) {
                for (const block of path) {
                    block.setType('path');
                }
            }
            else {
                console.log("No Solution!");
            }

            startAlgo = !startAlgo;
        }
    }
}


// Release Mouse (Moving Source/Target Block)
function mouseReleased() {
    if (moveBlock) {
        // Get what previous type was
        const type = blocks[moveBlock.x][moveBlock.y].type;
        
        // Remove from Blocks
        blocks[moveBlock.x][moveBlock.y].setType(null);
        
        // Drop Source Block
        moveBlock.x = moveX;
        moveBlock.y = moveY;

        // Reset Block Type
        blocks[moveBlock.x][moveBlock.y].setType(type);
        
        
        // Done
        moveBlock = null;
    }
}

// Draw/Erase Wall
function mouseDragged() {
    // Check Mouse is Within Canvas
    if (mouseX < width  && mouseX >= 0 &&
        mouseY < height && mouseY >= 0) {
        
        const x = floor(map(mouseX, 0, width, 0, rows));
        const y = floor(map(mouseY, height, 0, cols, 0));

        // Check if Source or Target was clicked
        if (!moveBlock) {
            // Source ?
            if (x == source.x && y == source.y) {
                moveBlock = source;
                return;
            }

            // Target?
            else if (x == target.x && y == target.y) {
                moveBlock = target;
                return;
            }
        }
        
        // Keep track of where moved to
        else {
            moveX = x;
            moveY = y;

            // ONLY MOVE BLOCK
            return;
        }


        const blockArr = blocks;
        
        blockArr[x][y].setWall(drawWallState);
    }
}

// Create Blocks Array
function initBlocks() {
    blocks = [];
    for (let i = 0; i < cols; i++) {
        blocks.push(new Array(rows));

        // Create Each Row Bloack
        for (let j = 0; j < rows; j++) {
            blocks[i][j] = new Block(createVector(i, j), null);


            // Randomly Spawn a Wall
            if (random() < wallRate) {
                blocks[i][j].setWall(true);
            }
        }
    }

    // Set Source and Targer
    blocks[source.x][source.y].setType('source').setWall(false);
    blocks[target.x][target.y].setType('target').setWall(false);
}


// Interactivity Functions
function initInteractive() {
    // Trigger A* Algorithm
    algoBtn = createButton("A* (On/Off)");
    algoBtn.mousePressed(() => startAlgo = !startAlgo);


    // Reset Search Algorithm
    resetBtn = createButton("Reset");
    resetBtn.mousePressed(() => {
        // Reset Blocks
        initBlocks();

        // Reset Algorithm
        searchAlgo.reset();

        // Reset Variables
        startAlgo = false;

        // Re Initiate Draw
        loop();
    });

    // Load/Save Blocks Button
    saveBtn = createButton("Save Blocks");
    saveBtn.mousePressed(() => {
        savedBlocks = backupBlocksArr()
        console.log("Saved!");
    });

    loadBtn = createButton("Load Blocks");
    loadBtn.mousePressed(() => {
        if (savedBlocks) {
            // Make a Deep copy before assigning
            blocks = savedBlocks;

            // Reset Variables
            startAlgo = false;

            // Re Initiate Draw
            loop();
        }
    });


    // Button Styles
    algoBtn.style("margin", "8px");
    resetBtn.style("margin", "8px");
    saveBtn.style("margin", "8px");
    loadBtn.style("margin", "8px");

    createP();
    
    // Draw Wall Type (Wall (On/Off))
    drawWallTypeBtn = createButton(`Wall Draw (${drawWallState ? "ON" : "OFF"})`);
    drawWallTypeBtn.mousePressed(() => {
        drawWallState = !drawWallState;

        // Update Button Text
        drawWallTypeBtn.elt.innerHTML = `Wall Draw (${drawWallState ? "ON" : "OFF"})`;
    });

    // Wall Rate P Tag
    wallRateP = createP("<strong style='color: orange;'>Wall Rate: </strong>" + (wallRate * 100) + '%');


    // Wall Rate Slider
    wallRateSlider = createSlider(0, 1, wallRate, 0.1);
    wallRateSlider.position(width - 100, height + 10);
    wallRateSlider.style('width', '100px');

    wallRateSlider.input(() => {
        wallRate = wallRateSlider.value();
        wallRateP.html("<strong style='color: orange;'>Wall Rate: </strong> " + (wallRate * 100) + '%');
    });
}

// Creates a Deep copy of Blocks Array
function backupBlocksArr() {
    const newBlockArr = [];

    for (const arr of blocks) {
        newBlockArr.push([]);

        for (const block of arr) {
            newBlockArr[newBlockArr.length - 1].push(block.copy());
        }
    }

    return newBlockArr;
}

// Clears Blocks Backup
function clearBackupBlock() {
    backupBlocksArr = null;
}