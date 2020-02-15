class A_Algorithm {

    /**
     * Construct the A* Algorithm
     * @param {*} src The Source Vector Position
     * @param {*} target The Target Vector Position
     * @param {Block[][]} blocksArray 2D Array of Block Objects
     */
    constructor(src, target, blocksArray) {
        // Set "Running-Time" Variables
        this.stepCurrent;
        
        // Set Properties
        this.src = src;
        this.target = target;
        this.blocksArray = blocksArray;
        this.prefferedCostHeuristic = null;

        // List of Sets
        this.openSet = [this.blocksArray[this.src.x][this.src.y]];
        this.closedSet = [];

        // List of Path to Target
        this.pathSet = [];
        
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

        // Pre-Sets
        // Set Source Blocks' F Score
        this.blocksArray[this.src.x][this.src.y].f = this.calculateDistance(this.src, this.target, 'euclidean');
    }

    /**
     * Removes Block Object from Block Object Array
     * @param {Block[]} arr Block Object Array
     * @param {Block} el Block Object
     */
    removeFromArray(arr, el) {
        // Loop backwards
        for (let i = arr.length - 1; i >= 0; i--) {
            if (el == arr[i]) {
                arr.splice(i, 1);
                break;
            }
        }
    }

    /**
     * @param {Block[]} arr Block Object Array
     * @param {Block} el Block Object Element
     * @returns Boolean for if Object was found in Array
     */
    elementInArray(arr, el) {
        // Loop Backwards
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i] == el)
                return true;
        }

        return false;
    }

    /**
     * Reconstucts the Path between Source and Target by working backwards
     * @param {Block} current Current Block Object
     * @returns Block Object Array for Path
     */
    reconstruct_path(current) {
        // Path Variable
        const totalPath = [current];
        
        // Work Backward
        while (current.parent) {
            current = current.parent;
            totalPath.push(current);
        }
        
        // Return Path
        return totalPath;
    }

    /**
     * @param {Block[]} arr Block Array
     * @returns Lowerst F Score in Array
     */
    getLowestF(arr) {
        let lowestBlock = null;

        if (arr.length > 0) {
            let lowestF = arr[0].f;
            lowestBlock = arr[0];

            for (const block of arr) {
                if (block.f < lowestF) {
                    lowestF = block.f;
                    lowestBlock = block;
                }
            }
        }

        return lowestBlock;
    }

    /**
     * Runs the Algorithm for finding the Source to Target
     * @returns Array of Blocks to Path | String if no solution
     */
    start() {
        while (this.openSet.length > 0) {
            // Obtain Lowest F-Score in OpenSet
            let current = this.getLowestF(this.openSet);


            // Check if Target Reached
            if (current == this.targetBlock) {
                return this.reconstruct_path(current);
            }
            

            // Add/Remove from Sets
            this.removeFromArray(this.openSet, current);
            this.closedSet.push(current);


            // Get Neighbors
            for (const neighbor of this.getValidNeighbors(current.position, this.blocksArray)) {
                // Variables Used
                const neighborBlock = this.blocksArray[neighbor.x][neighbor.y];

                // Ignore Previously Evaluated Neighbor
                if (this.elementInArray(this.closedSet, neighborBlock))
                    continue;

                // Calculate Distance from Start to Neighbor
                const tentative_gScore = current.g + this.calculateDistance(current.position, neighbor, this.prefferedCostHeuristic ? this.prefferedCostHeuristic : 'euclidean');


                // Check Neighbor Node New Node Discovered
                if (!this.elementInArray(this.openSet, neighborBlock)) {
                    this.openSet.push(neighborBlock);
                }

                // Check if Horrible G Score
                else if (tentative_gScore >= neighborBlock.g) {
                    continue;
                }


                // Best path so far, Record it!
                neighborBlock.parent = current;         // Set Neighbor's Parent

                // Set Neighbor's G & F Score
                neighborBlock.g = tentative_gScore;
                neighborBlock.f = this.calculateDistance(neighbor, this.target, this.prefferedCostHeuristic ? this.prefferedCostHeuristic : 'euclidean');
            }
        }

        // Set Algorithm State
        this.isDone = true;

        // No Solution
        return "No Solution";
    }


    /**
     * Runs Algorithm while returning Each run through's
     *  results. (Step by Step)
     * @returns Block Object Array for Path
     */
    run() {
        // Check if Algorithm finished
        if (this.isDone) return this.reconstruct_path(this.stepCurrent);


        if (this.openSet.length > 0) {
            // Obtain Lowest F-Score in OpenSet
            let current = this.getLowestF(this.openSet);


            // Check if Target Reached
            if (current == this.targetBlock) {
                this.isDone = true;
                return this.reconstruct_path(current);
            }
            

            // Add/Remove from Sets
            this.removeFromArray(this.openSet, current);
            this.closedSet.push(current);


            // Get Neighbors
            for (const neighbor of this.getValidNeighbors(current.position, this.blocksArray)) {
                // Variables Used
                const neighborBlock = this.blocksArray[neighbor.x][neighbor.y];

                // Ignore Previously Evaluated Neighbor
                if (this.elementInArray(this.closedSet, neighborBlock))
                    continue;

                // Calculate Distance from Start to Neighbor
                const tentative_gScore = current.g + this.calculateDistance(current.position, neighbor, this.prefferedCostHeuristic ? this.prefferedCostHeuristic : 'euclidean');


                // Check Neighbor Node New Node Discovered
                if (!this.elementInArray(this.openSet, neighborBlock)) {
                    this.openSet.push(neighborBlock);
                }

                // Check if Horrible G Score
                else if (tentative_gScore >= neighborBlock.g) {
                    continue;
                }


                // Best path so far, Record it!
                neighborBlock.parent = current;         // Set Neighbor's Parent

                // Set Neighbor's G & F Score
                neighborBlock.g = tentative_gScore;
                neighborBlock.f = this.calculateDistance(neighbor, this.target, this.prefferedCostHeuristic ? this.prefferedCostHeuristic : 'euclidean');
            }

            // Return Step Path
            this.stepCurrent = current;
            return this.reconstruct_path(current);
        }
        
        else {
            // No Solution
            this.isDone = true;
            return "No Solution"
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
            h = Math.sqrt(Math.pow((node.x - target.x), 2) + Math.pow((node.y - target.y), 2));
        }

        else {
            // Some Error Occurred
            console.error("Heuristic Not Found!");
        }

        return h;
    }

    /**
     * Sets Preffered Heuristic
     * @param {string} heuristic The Heuristic Type ('manhattan', 'diagonal', 'euclidean')
     */
    setPrefferedHeuristic(heuristic) {
        // Lowercase heuristics String
        heuristic = heuristic.toLocaleLowerCase();

        // Make sure Valid
        if (heuristic != 'manhattan' && heuristic != 'diagonal' && heuristic != 'euclidean')
            return console.error("Invalid Heuristic Type!");
        else
            this.prefferedCostHeuristic = heuristic;
    }
}