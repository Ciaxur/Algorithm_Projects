class Grid {
    /**
     * Constructs the Grid System
     * 
     * @param {number} rows The Rows of the Grid
     * @param {number} cols The Columns of the Grid
     */
    constructor(rows, cols) {
        // Assign  Block Colors
        this.openColor = color(80);                 // Default is Gray
        this.closedColor = color(200, 0, 0);        // Default is Red-ish
        this.sourceColor = color(0, 255, 0);        // Default is Green
        this.targetColor = color(0, 100, 100);      // Default is Teal
        this.wallColor = color(255, 125, 80);       // Default is Orange-ish
        
        // Assign Rows and Columns
        this.rows = rows;
        this.cols = cols;

        // Calculate the Size of Rectangle
        this.rectSizeHeight = width/this.rows;
        this.rectSizeWidth = height/this.cols;
    }

    /**
     * Draws the Grid onto the Canvas
     */
    drawGrid() {
        // Draw the Rows
        for (let r = 0; r < height; r+= this.rectSizeWidth) {
            line(r, 0, r, height);
        }

        // Draw the Columns
        for (let c = 0; c < width; c += this.rectSizeHeight) {
            line(0, c, width, c);
        }
    }

    /**
     * Draws the Blocks onto Grid
     * @param {Block[][]} blocks Block Object Array
     */
    drawBlocks(blocks) {
        // Validate Blocks Array
        if (blocks.length != this.cols && blocks[0].length != this.rows) {
            console.error("Invalid Block Array Size! Array must fit the Columns and Rows of Grid");
            return;
        }

        
        // Loop through each Grid Block and draw it's type
        for (let col = 0; col < blocks.length; col++) {
            // Loop through each Block in row
            for (let row = 0; row < blocks[col].length; row++) {
                const block = blocks[col][row];

                // Only Check Used Blocks
                if (block.type !== undefined) {

                    // Closed Blocks
                    if (block.type == 'closed') {
                        fill(this.closedColor);
                        rect((col) * (height / this.cols), (row) * (width / this.rows), this.rectSizeWidth, this.rectSizeHeight);
                    }

                    // Wall Colors
                    else if (block.isWall) {
                        fill(this.wallColor);
                        rect((col) * (height / this.cols), (row) * (width / this.rows), this.rectSizeWidth, this.rectSizeHeight);
                    }

                    // Open BLocks
                    else if (block.type == 'open') {
                        fill(this.openColor);
                        rect((col) * (height / this.cols), (row) * (width / this.rows), this.rectSizeWidth, this.rectSizeHeight);
                    }

                    // Source BLocks
                    else if (block.type == 'source') {
                        fill(this.sourceColor);
                        rect((col) * (height / this.cols), (row) * (width / this.rows), this.rectSizeWidth, this.rectSizeHeight);
                    }

                    // Target BLocks
                    else if (block.type == 'target') {
                        fill(this.targetColor);
                        rect((col) * (height / this.cols), (row) * (width / this.rows), this.rectSizeWidth, this.rectSizeHeight);
                    }
                    
                }
            }
        }
    }

    /**
     * Sets the Colors of Blocks
     * 
     * @param {color} openColor 
     * @param {color} closedColor 
     * @param {color} sourceColor 
     * @param {color} targetColor 
     */
    setBlockColors(openColor, closedColor, sourceColor, targetColor, wallColor) {
        if (openColor != null) {
            this.openColor = openColor;
        }

        if (closedColor != null) {
            this.closedColor = closedColor;
        }

        if (sourceColor != null) {
            this.sourceColor = sourceColor;
        }

        if (targetColor != null) {
            this.targetColor = targetColor;
        }

        if (wallColor != null) {
            this.wallColor = wallColor;
        }
    }
}