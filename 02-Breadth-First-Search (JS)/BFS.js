class BreadthFirstSearch {
    // Variables Used
    constructor() {
        this.reset();
    }
    
    /**
     * Breadth-First Search Algorithm
     *  Traverses through the graph in Layers to end point
     * 
     * @param {Block[][]} G Blocks Graph to traverse
     * @param {Block} s Starting Node in the Graph
     * @returns {Block[]} Full Constructed Path to Target Block 
     */
    BFS(G, s) {
        // Begin with a Queue or Previous Queue
        const queue = this.queue ? this.queue : [s];

        // Set the Beginning Node as Visited
        s.setType('source');

        // Loop through the Queue until no more nodes
        while (queue.length > 0) {
        // Remove Node from queue that will be used to visit the neighbors
            const v = queue.pop();

            // Process the Neighbors of v
            for (const neighbor of this.getNeighbors(G, v)) {
                // Check if reached Target
                if (neighbor.type == 'target') {
                    this.done = true;
                    
                    neighbor.parent = v;
                    return this.construct_path(neighbor);
                }

                // Avoid Walls
                if (!neighbor.isWall) {
                
                    // Check if unvisited node
                    if (neighbor.type == null) {
                        queue.unshift(neighbor);
                        neighbor.setType('open');
                        neighbor.parent = v;
                    }
                    
                    // Check if node was re-visited
                    else if (neighbor.type == 'open') {
                        neighbor.setType('closed');
                    }

                }
            }
            
        }

        // No Solution
        this.done = true;
        return [];
    }

    /**
     * Breadth-First Search Algorithm
     *  Traverses step-by-step through the graph in Layers to end point
     * 
     * @param {Block[][]} G Blocks Graph to traverse
     * @param {Block} s Starting Node in the Graph
     * @returns {Block[]} Next Constructed Path to Target
     */
    step_BFS(G, s) {
        // Begin with a Queue
        this.queue = this.queue ? this.queue : [s];

        // Set the Beginning Node as Visited
        s.setType('source');

        // Loop through the Queue until no more nodes
        if (this.queue.length != 0) {
            // Remove Node from queue that will be used to visit the neighbors
            const v = this.queue.pop();

            // Process the Neighbors of v
            for (const neighbor of this.getNeighbors(G, v)) {
                // Check if reached Target
                if (neighbor.type == 'target') {
                    this.done = true;

                    neighbor.parent = v;
                    return this.construct_path(neighbor);
                }

                // Avoid Walls
                if (!neighbor.isWall) {
                
                    // Check if unvisited node
                    if (neighbor.type == null) {
                        this.queue.unshift(neighbor);
                        neighbor.setType('open');
                        neighbor.parent = v;
                    }
                    
                    // Check if node was re-visited
                    else if (neighbor.type == 'open') {
                        neighbor.setType('closed');
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
        this.queue = null;
        this.done = false;
    }
}