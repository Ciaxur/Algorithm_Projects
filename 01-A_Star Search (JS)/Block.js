class Block {
    /**
     * Constructs the Block
     * @param {*} pos Position Vector of Block
     * @param {string} type Type of Block (Null: None | Target | Source | Open | Closed)
     */
    constructor(pos, type) {
        // Block Properties
        this.position = pos;
        this.type = type;           // Null: None | Target | Source | Open | Closed
        this.isWall = false;        // Wall or Not

        // Set Scores
        this.g = 1;                 // G Score default is '1' | Cost of this node
        this.f = null;              // F Score is from Node to Goal
    }

    /**
     * Sets State of Block Wall
     * @param {boolean} state State of Wall Type
     */
    setWall(state) {
        this.isWall = state;
    }

    /**
     * Sets the Block's Type
     * @param {string} type Type of Block (Null: None | Target | Source | Open | Closed)
     */
    setType(type) {
        this.type = type ? type.toLocaleLowerCase() : null;

        // Returns Current Object
        return this;
    }

    /**
     * Sets the New Position of Bloack
     * @param {*} pos New Vector Position
     */
    setPosition(pos) {
        this.position = pos.copy();
    }
}