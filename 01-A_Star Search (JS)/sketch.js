// Algorithm Variables
let A_Star;
let path;
let startAlgo = false;
let source, target, blocks;
let heuristic = "euclidean";
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
let heuristicRadio;
let saveBtn, loadBtn;
let b = new Block()



// P5 Functions
function setup() {
    createCanvas(800, 800);

    // Interactivity
    initInteractive();
    

    // Create Grid System
    grid = new Grid(rows, cols);

    // Set Source and Target
    source = createVector(0, 0);
    target = createVector(cols-1, rows-1);
    
    // Create Blocks Array
    initBlocks();

    // Create A* Algorithm Class
    A_Star = new A_Algorithm(source, target, blocks);
    if (heuristic)
        A_Star.setPrefferedHeuristic(heuristic);
}

function draw() {
    background(0);

    stroke(255, 255, 255, 50);
    grid.drawGrid();
    grid.drawBlocks(A_Star.getBlockArray());

    // Run the Algorithm
    if (startAlgo) {
        if (!A_Star.isDone) {
            // Run A* Algo
            path = A_Star.run();
            
            // Check if No Solution
            if (!(path instanceof Array)) {
                console.log(path);
            }

            // Draw Sets & Paths
            else {
                const openSet = A_Star.openSet;
                const closedSet = A_Star.closedSet;

                // Apply Open & Closed Set types
                for (const block of openSet) {
                    block.setType('open');
                }
                for (const block of closedSet) {
                    block.setType('closed');
                }

                // Draw Path
                for (const block of path) {
                    block.setType('path');
                }

                path[0].setType('source');
            }
        }
        else {
            // Log Results
            console.log("Path Length: ", path.length);
            console.log("Closed Set Length: ", A_Star.closedSet.length);
            console.log("Open Set Length: ", A_Star.openSet.length);
            
            // No More Looping
            startAlgo = false;
            noLoop();
        }
    }
}



// Draw/Erase Wall
function mouseDragged() {
    // Check Mouse is Within Canvas
    if (mouseX < width  && mouseX >= 0 &&
        mouseY < height && mouseY >= 0) {
        
        const x = floor(map(mouseX, 0, width, 0, rows));
        const y = floor(map(mouseY, height, 0, cols, 0));
        const blockArr = A_Star.getBlockArray();
        
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
}


// Interactivity Functions
function initInteractive() {
    // Trigger A* Algorithm
    algoBtn = createButton("A* (On/Off)");
    algoBtn.mousePressed(() => startAlgo = !startAlgo);


    // Reset A* Algorithm
    resetBtn = createButton("Reset");
    resetBtn.mousePressed(() => {
        // Reset Blocks
        initBlocks();

        // Reset A*
        A_Star = new A_Algorithm(source, target, blocks);

        if (heuristic)
            A_Star.setPrefferedHeuristic(heuristic);

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
            
            // Reset A*
            A_Star = new A_Algorithm(source, target, backupBlocksArr());

            if (heuristic)
                A_Star.setPrefferedHeuristic(heuristic);

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

    // Heuristic Radio Buttons
    heuristicRadio = createRadio();
    heuristicRadio.option("euclidean");
    heuristicRadio.option("manhattan");
    heuristicRadio.option("diagonal");
    heuristicRadio.selected(heuristic);
    heuristicRadio.changed(() => {
        heuristic = heuristicRadio.value()
        A_Star.setPrefferedHeuristic(heuristic);
    });


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