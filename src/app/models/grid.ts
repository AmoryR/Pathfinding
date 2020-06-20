
import { Cell, CellType } from './cell';

export class Grid {

    private _cells: Cell[] = [];

    constructor(width: number, height: number) {

        for (let i = 0; i < width * height; i++) {
            this._cells.push(new Cell());
        }

    }

    // ----------------------------------------------------------------------------
	// @ Mutator methods
	// ----------------------------------------------------------------------------

    get cells() : Cell[] { return this._cells; }
    set cells(value: Cell[]) { this._cells = value; }

    // ----------------------------------------------------------------------------
	// @ Public methods
    // ----------------------------------------------------------------------------
    
    // Get cell at index

}