class DepthFirstSearch {
    // Variables Used
    constructor() {
        this.reset();
    }

    /**
     * Runs Depth-First-Search Algorithm until target block reached
     * 
     * @param {Block[][]} G Block Array Graph
     * @param {Block} s Root Node Block
     * @returns {Block[]} Block Array of Path
     */
    DFS(G, s) {
        // Create Stack
        const stack = this.stack ? this.stack : [s];

        // Run Entire DFS Until found
        while (stack.length != 0) {
            // Get the last block
            const v = stack.pop();


            // Check Discovery Status
            if (v.type != 'closed') {
                v.setType('closed');        // Label as Discovered


                // Get all Adjacent Edges of 'v'
                for (const edge of this.getNeighbors(G, v)) {
                    // Ignore Walls
                    if (!edge.isWall) {
                        // Check if Target reached
                        if (edge.type == 'target') {
                            this.done = true;
                            
                            edge.parent = v;
                            return this.construct_path(edge);
                        }
                        
                        // Mark as Visited
                        if (edge.type == null) {
                            edge.setType('open');

                            // Assign Parent
                            edge.parent = v;

                            // Add to Stack
                            stack.push(edge);
                        }
                    
                        // Mark as Re-Visited
                        else if (edge.type != 'closed') {
                            edge.setType('closed');

                            // Remove from Stack
                            this.removeFromArr(stack, edge);
                        }
                    }
                }


            }
        }

        // No Solution
        this.done = true;
        return null;
    }

    
    /**
     * Runs Depth-First-Search Algorithm step by step until target block reached
     * 
     * @param {Block[][]} G Block Array Graph
     * @param {Block} s Root Node Block
     * @returns {Block[]} Block Array of each iteration's Path
     */
    step_DFS(G, s) {
        // Initiate Stack
        this.stack = this.stack ? this.stack : [s];

        // Iterate one step
        if (this.stack.length != 0) { 
            // Get the last block
            const v = this.stack.pop();


            // Check Discovery Status
            if (v.type != 'closed') {
                v.setType('closed');        // Label as Discovered

                // Get all Adjacent Edges of 'v'
                for (const edge of this.getNeighbors(G, v)) {
                    // Ignore Walls
                    if (!edge.isWall) {
                        // Check if Target reached
                        if (edge.type == 'target') {
                            this.done = true;

                            edge.parent = v;
                            return this.construct_path(edge);
                        }
                        
                        // Mark as Visited
                        if (edge.type == null) {
                            edge.setType('open');

                            // Assign Parent
                            edge.parent = v;

                            // Add to Stack
                            this.stack.push(edge);
                        }
                    
                        // Mark as Re-Visited
                        else if (edge.type != 'closed') {
                            edge.setType('closed');

                            // Remove Element from Stack
                            this.removeFromArr(this.stack, edge);
                        }
                    }
                }


            }
        }
    }



    /**
     * Finds element in an array and removes it
     * @param {Block[]} arr 
     * @param {Block} el 
     */
    removeFromArr(arr, el) {
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i] == el) {
                arr.splice(i, 1);
                return;
            }
        }
    }


    /**
     * Constructs the Path of the node by traversing backward to parents
     * @param s Node child
     * @returns Path backwards to parents
     */
    construct_path(s) {
        // Create the Path Array
        const path = [s];
        
        // Transverse backwards till root
        while (s.parent) {
            s = s.parent;
            path.push(s);
        }

        // Return the Transversed Path
        return path;
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
     * Resets the State of Search Algorithm
     */
    reset() {
        this.stack = null;
        this.done = false;
    }
}