
import { Cell, CellType } from './cell';
import { Point } from './point';

export class Grid {

    private _width: number = 0;
    private _height: number = 0;
    private _cells: Cell[] = [];

    constructor(width: number, height: number) {

        this._width = width;
        this._height = height;

        for (let i = 0; i < width * height; i++) {
            this._cells.push(new Cell());
        }

    }

    // ----------------------------------------------------------------------------
	// @ Mutator methods
	// ----------------------------------------------------------------------------

    get width() : number { return this._width; }
    get height() : number { return this._height; }
    get cells() : Cell[] { return this._cells; }
    get length() : number { return this._width * this._height; }

    // ----------------------------------------------------------------------------
	// @ Public methods
    // ----------------------------------------------------------------------------

    /**
     * Get index from X and Y coordinates
     * 
     * @param x 
     * @param y 
     * 
     * @returns Correspondant index
     */
    private getIndexFor(x: number, y: number) : number {
        return x + y * this._width;
    }


    /**
     * Get coordinates X and Y from index
     * 
     * @param index 
     * 
     * @retuns Correspondant coordinates
     */
    private getCoordinatesFor(index: number) : Point {
        let x = index % this._width;
        let y = (index - x) / this._width;

        return new Point(x, y);
    }

    /**
     * Set cell from X and Y coordinates
     * 
     * @param x 
     * @param y 
     */
    setCellFor(x: number, y: number, cell: Cell) {
        this._cells[this.getIndexFor(x, y)] = cell;
    }

    /**
     * Get cell from X and Y coordinates
     * 
     * @param x 
     * @param y 
     * 
     * @returns Correspondant cell
     */
    getCellFor(x: number, y: number) : Cell {
        return this._cells[this.getIndexFor(x, y)];
    }

    /**
     * Get start coordinates
     * 
     * @returns Start cell coordinates (X,Y) from grid
     */
    getStartCoordinates() : Point {

        let coordinates = new Point(-1, -1);

        this._cells.forEach((cell: Cell, index: number) => {
            if (cell.type == CellType.start) {
                coordinates = this.getCoordinatesFor(index);
            }
        });

        return coordinates;
    }

    /**
     * Get end coordinates
     * 
     * @returns End cell coordinates (X,Y) from grid
     */
    getEndCoordinates() : Point {
        let coordinates = new Point(-1, -1);

        this._cells.forEach((cell: Cell, index: number) => {
            if (cell.type == CellType.end) {
                coordinates = this.getCoordinatesFor(index);
            }
        });

        return coordinates;
    }


}