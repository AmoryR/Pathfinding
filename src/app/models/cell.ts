
export enum CellType {
    start = "start",
    end = "end",
    wall = "wall",
    empty = "empty"
}

export class Cell {

    private _type = CellType.empty;

    constructor() {

    }

    // ----------------------------------------------------------------------------
	// @ Mutator methods
	// ----------------------------------------------------------------------------

    get type() : CellType { return this._type; }
    set type(value: CellType) { this._type = value; }

}