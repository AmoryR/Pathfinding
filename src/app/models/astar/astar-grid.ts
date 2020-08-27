import { Grid } from "../grid";
import { CellType } from '../cell';
import { AstarCell } from './astar-cell';


export class AstarGrid {

    private _referenceGrid: Grid;
	private _width: number = 0;
	private _height: number = 0;
	private _cells: AstarCell[] = [];

	constructor(width: number, height: number, grid: Grid) {


		this._referenceGrid = grid;
		this._width = width;
		this._height = height;
		
		for (let i = 0; i < width * height; i++) {
			let newCell = new AstarCell();

			let coordinates = this.getCoordinatesFor(i);

			newCell.x = coordinates.x;
			newCell.y = coordinates.y;

            this._cells.push(newCell);
		}
    }

    // ----------------------------------------------------------------------------
	// @ Mutator methods
	// ----------------------------------------------------------------------------

    get width() : number { return this._width; }
	get height() : number { return this._height; }
	get containsUnvisited(): boolean {

		let cu = false;

		this._cells.forEach((cell: AstarCell) => {
			if (!cell.visited) {
				cu = true;
			}
		});

		console.log("cu", cu);
		return cu;
	}
    
    private getCoordinatesFor(index: number) : { x: number, y: number } {
        let x = index % this._width;
        let y = (index - x) / this._width;

        return {
            x: x,
            y: y
		};
    }
    
    getIndexFor(x: number, y: number) : number {
        return x + y * this.width;
    }

	getCellFor(x: number, y: number) : AstarCell {
        return this._cells[this.getIndexFor(x, y)];
    }
    
    minimunDistanceCell() : AstarCell {
		let cellToSearch = this._cells.filter((cell: AstarCell) => {
			return cell.visited;
		});
		
        var minDistCell = cellToSearch[0];
		cellToSearch.forEach((cell: AstarCell) => {

            if (cell.destinationDist < minDistCell.destinationDist
                && this._referenceGrid.getCellFor(cell.x, cell.y).type != CellType.start) {
				minDistCell = cell;
            }
            
		});

		return minDistCell;
    }
    
    getNeighborsOf(cell: AstarCell) : AstarCell[] {
		
		let neighbors: AstarCell[] = [];

		if (cell.x > 0) {

			let referenceCell = this._referenceGrid.getCellFor(cell.x - 1, cell.y);
			if (referenceCell.type != "wall") {
				neighbors.push(this.getCellFor(cell.x - 1, cell.y));
			}

		}

		if (cell.x < this._width - 1) {

			let referenceCell = this._referenceGrid.getCellFor(cell.x + 1, cell.y);
			if (referenceCell.type != "wall") {
				neighbors.push(this.getCellFor(cell.x + 1, cell.y));
			}

		}

		if (cell.y > 0) {

			let referenceCell = this._referenceGrid.getCellFor(cell.x, cell.y - 1);
			if (referenceCell.type != "wall") {
				neighbors.push(this.getCellFor(cell.x, cell.y - 1));
			}

		}

		if (cell.y < this._height - 1) {

			let referenceCell = this._referenceGrid.getCellFor(cell.x, cell.y + 1);
			if (referenceCell.type != "wall") {
				neighbors.push(this.getCellFor(cell.x, cell.y + 1));
			}

		}

		return neighbors;
	}
    
}