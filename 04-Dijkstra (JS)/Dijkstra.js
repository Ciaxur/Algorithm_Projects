class Dijkstra {
    /**
     * Constructs Default Data neded for Dijkstra
     *  Optional Parameters used for Pre-Loading
     * 
     * @param {Block[]} G Graph that will be initialized (OPTIONAL)
     * @param {Block} s Block Source (OPTIONAL)
     */
    constructor(G, s) {
        // Initialize Graph if any
        this.vertexSet = G ? this.initializeGraph(G, s) : null;

        // Set Default Heuristic
        this.heuristic = "euclidean";

        // Dijkstra State
        this.done = false;
    }

    /**
     * Resets State of Dijkstra
     */
    reset() {
        this.done = false;
        this.vertexSet = null;
    }



    /**
     * Initiates Dijkstra's Algorithm until Target Block reached
     * 
     * @param {Block[]} G Block Graph
     * @param {Block} s Block Source
     * @returns {Block[]} Path Array to Target from Source
     */
    start(G, s) {
        // Initalize Graph if no Graph Initiatlized
        this.vertexSet = this.vertexSet ? this.vertexSet : this.initializeGraph(G, s);

        // Start Algorithm
        while (this.vertexSet.length > 0) {
            // Get the Shortest Distance Node
            const u = this.getShortestDistance(this.vertexSet);

            // Make sure valid Distance
            if (u.g == Infinity) {
                this.done = true;
                return null;
            }

            // Set Node as Closed (Non-Target)
            if(u.type != 'source')
                u.setType('closed');

            // Remove Node 'u' from Set
            this.removeFromArr(this.vertexSet, u);

            // Loop through u's Neighbors
            for (const v of this.getNeighbors(G, u)) {
                // Ignore Walls
                if (v.isWall) continue;
                
                // Check if Target Found
                if (v.type == 'target') {
                    this.done = true;

                    v.parent = u;
                    return this.construct_path(v);
                }
                
                // Only Neighbors that are in Vertex Set
                if (this.vertexSet.includes(v)) {
                    // Find best Path Cost
                    const alt = u.g + this.distance(u.position, v.position);

                    // Check if Better Cose
                    if (alt < v.g) {
                        v.g = alt;
                        v.parent = u;
                    }
                }
            }
        }
        
        // No Solution
        this.done = true;
        return null;
    }


    /**
     * Initiates Dijkstra's Algorithm until Target Block reached
     * 
     * @param {Block[]} G Block Graph
     * @param {Block} s Block Source
     * @returns {Block[]} Path Array to Target from Source
     */
    step_start(G, s) {
        // Initalize Graph if no Graph Initiatlized
        this.vertexSet = this.vertexSet ? this.vertexSet : this.initializeGraph(G, s);

        // Start Algorithm
        if (this.vertexSet.length > 0) {
            // Get the Shortest Distance Node
            const u = this.getShortestDistance(this.vertexSet);

            // Make sure valid Distance
            if (u.g == Infinity) {
                this.done = true;
                return null;
            }
            
            
            // Set Node as Closed (Non-Target)
            if(u.type != 'source')
                u.setType('closed');

            // Remove Node 'u' from Set
            this.removeFromArr(this.vertexSet, u);


            // Loop through u's Neighbors
            for (const v of this.getNeighbors(G, u)) {
                // Ignore Walls
                if (v.isWall) continue;
                
                // Check if Target Found
                if (v.type == 'target') {
                    this.done = true;

                    v.parent = u;
                    return this.construct_path(v);
                }
                
                // Only Neighbors that are in Vertex Set
                if (this.vertexSet.includes(v)) {
                    // Find best Path Cost
                    const alt = u.g + this.distance(u.position, v.position);

                    // Check if Better Cose
                    if (alt < v.g) {
                        v.g = alt;
                        v.parent = u;
                    }
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
     * Finds valid neighbors of Vertex
     * 
     * @param {Block[][]} G Block Array Graph
     * @param {Block} v Block vertex
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
     * Finds shortest distance from Block Set Nodes
     * 
     * @param {Block[]} Q Block Set of Verticies
     * @returns {Block} Shortest Block Node
     */
    getShortestDistance(Q) {
        // Set Highscore
        let highscore = Q.length > 0 ? Q[0] : null;

        // Loop through all Verticies and Find smallest distance score
        for (const w of Q) {
            if (w.g < highscore.g) {
                highscore = w;
            }
        }

        // Return the shortest Distance Node
        return highscore;
    }

    /**
     * Calculates the Distance between 's' and 'v' using
     *  Euclidean Formula
     * 
     * @param {Block} s Source Block Node
     * @param {Block} v Vertex Block Node
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
     * Initialized graph's scores
     * 
     * @param {Block[][]} G Block Graph
     * @param {Block} s Block Source
     * @returns {Block[]} Initialized Graph with Scores
     */
    initializeGraph(G, s) {
        // Create Set
        const vertexSet = [];
        
        // Initialize Graph Node Scores
        for (const arr of G) {
            for (const v of arr) {
                // Set Cost from Source -> Node
                v.g = Infinity;

                // Set Previous Node
                v.parent = null;

                // Add to Set
                vertexSet.push(v);
            }
        }

        // Set Source Node Data
        s.g = 0;                    // Cost of Source -> Source


        // Return Vertex Set
        return vertexSet;
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