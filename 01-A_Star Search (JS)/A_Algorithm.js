class A_Algorithm {

    /**
     * Construct the A* Algorithm
     * @param {*} src The Source Vector Position
     * @param {*} target The Target Vector Position
     * @param {Block[][]} blocksArray 2D Array of Block Objects
     */
    constructor(src, target, blocksArray) {
        // Set Properties
        this.src = src;
        this.target = target;
        this.blocksArray = blocksArray;
        this.neighbors;

        // List of Open Sets
        this.openSet = [];

        // Set Source & Its Properties
        this.blocksArray[this.src.x][this.src.y].setType("source");
        this.blocksArray[this.src.x][this.src.y].isWall = false;
        this.blocksArray[this.src.x][this.src.y].g = 0;
        this.blocksArray[this.src.x][this.src.y].f = this.calculateDistance(this.src, this.target, 'euclidean');

        // Set Target & Its Properties
        this.targetBlock = this.blocksArray[this.target.x][this.target.y].setType("target");
        this.targetBlock.isWall = false;

        // Algorithm State
        this.isDone = false;
    }

    /**
     * Runs Algorithm on Blocks Object Array
     */
    run() {
        // Check if Target Reached
        if (this.isDone) return;
        
        // Keep Track of Best Neighbor Score
        let bestNeighbor = null;
        
        // Get Neighbors
        // Calculate Distance to Target for Each Neighbor Block
        this.neighbors = this.getValidNeighbors(this.src, this.blocksArray);

        
        // Make sure there are Neighbors Left
        if (!this.neighbors.length) {
            // Last Resort to Open Set
            if (!this.openSet.length) {
                console.log("No More Neighbors");
                this.isDone = true;
            }
            
            // Get a Source from Open Set
            else {
                this.setNewSource(this.openSet.pop().position);
            }

            return;
        }


        // Set Neighbor Data
        for (const neighbor of this.neighbors) {
            const block = this.blocksArray[neighbor.x][neighbor.y];

            // Add Block to Open Set
            this.openSet.push(block);
            
            // Set Type of Unused Block
            block.setType("open");

            // Set Neighbor Node's Score for Distance to Target
            block.g = this.calculateDistance(neighbor, this.target, 'euclidean');


            // Select Best Neighbor from Score
            if (!bestNeighbor || block.g < bestNeighbor.g) {
                bestNeighbor = block;
            }
        }

        // Head off to next best neighbor
        this.setNewSource(bestNeighbor.position);

        // Check if Target Reached
        if (bestNeighbor == this.targetBlock) {
            console.log("Done!");
            this.isDone = true;
        }
    }


    /**
     * Checks and Returns Valid (Not Visited or Open) Block Neighbors
     * @param {*} block The Block Position Vector
     * @param {Block[][]} arr The Array of Blocks
     * @returns Array of Vectors indicating Positions of Neighbors
     */
    getValidNeighbors(block, arr) {
        const neighbors = [];
        
        // Get Above Neighbor
        if ((block.y - 1) >= 0) {        // Check if there is a Row above
            if (this.validBlock(arr[block.x][block.y - 1])) {
                neighbors.push(createVector(block.x, block.y - 1));
            }
        }

        // Check Right Neighbor
        if ((block.x + 1) < arr.length) {
            if (this.validBlock(arr[block.x + 1][block.y])) {
                neighbors.push(createVector(block.x + 1, block.y));
            }
        }

        // Check Left Neighbor
        if ((block.x - 1) >= 0) {
            if (this.validBlock(arr[block.x - 1][block.y])) {
                neighbors.push(createVector(block.x - 1, block.y));
            }
        }

        // Check Bottom Neighbor
        if ((block.y + 1) < arr[arr.length-1].length) {
            if (this.validBlock(arr[block.x][block.y + 1])) {
                neighbors.push(createVector(block.x, block.y + 1));
            }
        }


        // Check Corners

        // Check Bottom-Right Corner
        if ((block.x + 1) < arr.length && (block.y + 1) < arr[arr.length - 1].length) {
            if (this.validBlock(arr[block.x + 1][block.y + 1])) {
                neighbors.push(createVector(block.x + 1, block.y + 1));
            }
        }

        // Check Top-Left Corner
        if ((block.x - 1) >= 0 && (block.y - 1) >= 0) {
            if (this.validBlock(arr[block.x - 1][block.y - 1])) {
                neighbors.push(createVector(block.x - 1, block.y - 1));
            }
        }

        // Check Top-Right Corner
        if ((block.x + 1) < arr.length && (block.y - 1) >= 0) {
            if (this.validBlock(arr[block.x + 1][block.y - 1])) {
                neighbors.push(createVector(block.x + 1, block.y - 1));
            }
        }

        // Check Bottom-Left Corner
        if ((block.x - 1) >= 0 && (block.y + 1) < arr[arr.length - 1].length) {
            if (this.validBlock(arr[block.x - 1][block.y + 1])) {
                neighbors.push(createVector(block.x - 1, block.y + 1));
            }
        }

        // Return Neighbors
        return neighbors;
    }

    /**
     * Checks if Block is Valid
     * @param {Block} block Block to test if valid
     * @returns State of Validity of Block
     */
    validBlock(block) {
        // Returns Validity of Block
        if (block.type == 'closed' || block.isWall) return false;

        return true;
    }

    /**
     * @returns Block Object Array
     */
    getBlockArray() {
        return this.blocksArray;
    }

    /**
     * Calculates the Distance Score of Node to Target
     * @param {*} node Vector Position of Node
     * @param {*} target Vector Position of Target from Node
     * @param {string} heuristic The Heuristic Type ('manhattan', 'diagonal', 'euclidean')
     * 
     * @returns Distance Score
     */
    calculateDistance(node, target, heuristic) {
        // Create Variable
        let h = null;
        
        // LowerCase Heuristics String
        heuristic = heuristic.toLocaleLowerCase();


        if (heuristic == 'manhattan') {
            h = Math.abs(node.x - target.x) + Math.abs(node.y - target.y);
        }

        else if (heuristic == 'diagonal') {
            h = Math.max( abs(node.x - target.x), abs(node.y - target.y) );
        }

        else if (heuristic == 'euclidean') {
            h = Math.sqrt( Math.pow((node.x - target.x), 2) + Math.pow((node.y - target.y), 2) );
        }

        else {
            // Some Error Occurred
            console.error("Heuristic Not Found!");
        }

        return h;
    }

    /**
     * Sets new Source Block
     * @param {*} pos Vector Position of Source
     */
    setNewSource(pos) {
        // Remove Previous Source
        this.blocksArray[this.src.x][this.src.y].setType('closed');

        // Remove from OpenSet
        // for (let i = 0; i < this.openSet.length; i++) {
        //     if (this.openSet[i] === this.blocksArray[this.src.x][this.src.y]) {
        //         this.openSet.splice(i, 1);
        //         break;
        //     }
        // }

        // Remove from Open Set
        // Backwards since it's more likely to be newer...
        for (let i = this.openSet.length-1; i >= 0; i--) {
            if (this.openSet[i] === this.blocksArray[this.src.x][this.src.y]) {
                this.openSet.splice(i, 1);
                break;
            }
        }

        // Create New Source
        this.src = pos;
        this.blocksArray[pos.x][pos.y].setType('source');
        this.blocksArray[pos.x][pos.y].use++;
    }
}