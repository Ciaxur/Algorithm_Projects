class Greedy {
    
    /**
     * Initiates Default State of Greedy Algorithm
     */
    constructor() {
        // Algorithm State
        this.reset();
        this.heuristic = "euclidean";
    }

    /**
     * Resets State of Algorithm
     */
    reset() {
        this.done = false;          // State of Algorithm
        this.graphInit = false;     // State of Graph Initializaion
        this.queue = null;          // Holds Queue of Blocks
    }



    /**
     * Initiates the Greedy Algorithm Completely
     * 
     * @param {Block[]} G Block Graph
     * @param {Block} s Block Source
     * @param {Block} t Block Target
     * @returns {Block[]} Path Array to Target from Source
     */
    start(G, s, t) {
        // Make sure Greedy is Ok!
        if (this.done) return null;
        
        // Initalize Graph
        this.initializeGraph(G, s, t);
        this.graphInit = true;

        // Add Source to Queue
        const queue = [s];

        // Begin Algo!
        while (queue.length > 0) {
            // Get the Shortest Heuristic Score (Node -> Goal)
            const node = this.getShortestDistance(queue);

            // Remove Node from Set
            this.removeFromArr(queue, node);

            // Set node's Type
            node.setType('closed');

            

            // Loop through node's Neighbors
            for (const v of this.getNeighbors(G, node)) {
                // Check if Neighbor is the Target
                if (v.type == 'target') {
                    this.done = true;
                    v.parent = node;
                    return this.construct_path(v);
                }
                
                
                // Skip Previously Visited Nodes
                // Avoid Walls
                if (v.type == null && !v.isWall) {
                    // Assign Heuristic Distance of Neighbors
                    v.f = this.distance(v.position, t.position);

                    // Assign Parent Link
                    v.parent = node;

                    // Add Neighbor to Queue
                    queue.push(v);

                    // Set as Open
                    v.setType('open');
                }
            }
        }

        // No Solution
        this.done = true;
        return null;
    }


    /**
     * Iterates Step-by-Step using the Greedy Algorithm
     * 
     * @param {Block[]} G Block Graph
     * @param {Block} s Block Source
     * @param {Block} t Block Target
     * @returns {Block[]} Path Array to Target from Source when Target Reached
     */
    step_start(G, s, t) {
        // Make sure Greedy is Ok!
        if (this.done) return null;
        
        // Initalize Graph
        if (!this.graphInit) {
            this.initializeGraph(G, s, t);
            this.graphInit = true;
        }

        // Add Source to Queue
        this.queue = this.queue ? this.queue : [s];

        // Begin Algo!
        if (this.queue.length > 0) {
            // Get the Shortest Heuristic Score (Node -> Goal)
            const node = this.getShortestDistance(this.queue);

            // Remove Node from Set
            this.removeFromArr(this.queue, node);

            // Set node's Type
            node.setType('closed');

            

            // Loop through node's Neighbors
            for (const v of this.getNeighbors(G, node)) {
                // Check if Neighbor is the Target
                if (v.type == 'target') {
                    this.done = true;
                    v.parent = node;
                    return this.construct_path(v);
                }
                
                
                // Skip Previously Visited Nodes
                // Avoid Walls
                if (v.type == null && !v.isWall) {
                    // Assign Heuristic Distance of Neighbors
                    v.f = this.distance(v.position, t.position);

                    // Assign Parent Link
                    v.parent = node;

                    // Add Neighbor to Queue
                    this.queue.push(v);

                    // Set as Open
                    v.setType('open');
                }
            }
        }

        // No Solution
        else {
            this.done = true;
            return null;
        }
    }


    

    /**
     * Initialized graph's scores
     * 
     * @param {Block[][]} G Block Graph
     * @param {Block} src Block Source
     * @param {Block} target Block Target
     */
    initializeGraph(G, src, target) {
        // Initialize Graph Node Scores
        for (const arr of G) {
            for (const v of arr) {
                // Set Distance from Node -> Target
                v.f = Infinity;
            }
        }

        // Set Source Node Data
        // Cost of Source -> Target
        src.f = this.distance(src.position, target.position);
    }
    

    /**
     * Finds shortest distance (Node -> Goal) from Block Set Nodes
     * 
     * @param {Block[]} Q Block Set of Verticies
     * @returns {Block} Shortest Block Node
     */
    getShortestDistance(Q) {
        // Set Highscore
        let highscore = Q.length > 0 ? Q[0] : null;

        // Loop through all Verticies and Find smallest distance score
        for (const w of Q) {
            if (w.f < highscore.f) {
                highscore = w;
            }
        }

        // Return the shortest Distance Node
        return highscore;
    }

    /**
     * Finds valid neighbors of Vertex
     * 
     * @param {Block[][]} G Block Array Graph
     * @param {Block} v Vertex Block
     * @returns {Block[]} Valid Neighboring Blocks
     */
    getNeighbors(G, v) {
        const neighbors = [];
        const block = v.position;

        // Get Above Neighbor
        if ((block.y - 1) >= 0) { // Check if there is a Row above
            neighbors.push(G[block.x][block.y - 1]);
        }

        // Check Right Neighbor
        if ((block.x + 1) < G.length) {
            neighbors.push(G[block.x + 1][block.y]);
        }

        // Check Left Neighbor
        if ((block.x - 1) >= 0) {
            neighbors.push(G[block.x - 1][block.y]);
        }

        // Check Bottom Neighbor
        if ((block.y + 1) < G[G.length - 1].length) {
            neighbors.push(G[block.x][block.y + 1]);
        }


        // Check Corners

        // Check Bottom-Right Corner
        if ((block.x + 1) < G.length && (block.y + 1) < G[G.length - 1].length) {
            neighbors.push(G[block.x + 1][block.y + 1]);
        }

        // Check Top-Left Corner
        if ((block.x - 1) >= 0 && (block.y - 1) >= 0) {
            neighbors.push(G[block.x - 1][block.y - 1]);
        }

        // Check Top-Right Corner
        if ((block.x + 1) < G.length && (block.y - 1) >= 0) {
            neighbors.push(G[block.x + 1][block.y - 1]);
        }

        // Check Bottom-Left Corner
        if ((block.x - 1) >= 0 && (block.y + 1) < G[G.length - 1].length) {
            neighbors.push(G[block.x - 1][block.y + 1]);
        }


        // Return the Neighbors
        return neighbors;
    }

    /**
     * Removes Node from Graph
     * 
     * @param {Block[]} arr Block Array Graph
     * @param {Block} el Element Block
     */
    removeFromArr(arr, el) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == el) {
                arr.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Calculates the Distance between 's' and 'v' using
     *  Euclidean Formula
     * 
     * @param {p5.Vector} s Source Position Node
     * @param {p5.Vector} v Vertex Position Node
     * @returns {Number} Distance between 's' and 'v'
     */
    distance(s, v) {
        // Create Variable
        let dist = null;


        if (this.heuristic == 'manhattan') {
            dist = Math.abs(s.x - v.x) + Math.abs(s.y - v.y);
        }

        else if (this.heuristic == 'diagonal') {
            dist = Math.max( abs(s.x - v.x), abs(s.y - v.y) );
        }

        else if (this.heuristic == 'euclidean') {
            dist = Math.sqrt(Math.pow((s.x - v.x), 2) + Math.pow((s.y - v.y), 2));
        }

        return dist;
    }

    /**
     * Sets Preffered Heuristic
     * @param {String} heuristic Heuristic Type (manhattan | diagonal | euclidean)
     */
    setHeuristic(heuristic) {
        // Lowercase Parameter
        heuristic = heuristic.toLocaleLowerCase();
        
        if (theuristic != 'manhattan' && theuristic != 'diagonal' && theuristic != 'euclidean')
            return console.error("Invalid Heruistic!");
        else
            this.heuristic = heuristic;
    }
    
    /**
     * Creates path by working backwards
     * 
     * @param {Block} v Vertex Reached
     * @returns {Block[]} Path Array from Source to Target 'v'
     */
    construct_path(v) {
        // Create the Path Array
        const path = [v];

        // Work backwards
        while (v.parent) {
            v = v.parent;
            path.push(v);
        }

        // Return Constructed Path
        return path;
    }
}