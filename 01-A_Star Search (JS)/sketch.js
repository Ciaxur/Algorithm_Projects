let grid;
let A_Star;

let rows = 75;
let cols = 75;
const wallRate = 0.5;
let neighbors;

function setup() {
    createCanvas(800, 800);

    // Create Grid System
    grid = new Grid(rows, cols);


    // Set Source and Target
    const source = createVector(0, 0);
    const target = createVector(cols-1, rows-1);
    
    // Create Blocks Array
    const blocks = [];
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

    // Create A* Algorithm Class
    A_Star = new A_Algorithm(source, target, blocks);
}

function draw() {
    background(0);

    stroke(255, 255, 255, 50);
    grid.drawGrid();
    grid.drawBlocks(A_Star.getBlockArray());

    // Run the Algorithm
    if (!A_Star.isDone)
        A_Star.run();
}


