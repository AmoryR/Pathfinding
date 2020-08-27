import { Grid } from '../grid';
import { DijkstraCell } from './dijkstra-cell';

export class DijkstraGrid {

	private _referenceGrid: Grid;
	private _width: number = 0;
	private _height: number = 0;
	private _cells: DijkstraCell[] = [];

	constructor(width: number, height: number, grid: Grid) {


		this._referenceGrid = grid;
		this._width = width;
		this._height = height;
		
		for (let i = 0; i < width * height; i++) {
			let newCell = new DijkstraCell();

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

		this._cells.forEach((cell: DijkstraCell) => {
			if (!cell.visited) {
				cu = true;
			}
		});

		console.log("cu", cu);
		return cu;
	}

	// ----------------------------------------------------------------------------
	// @ Public methods
	// ----------------------------------------------------------------------------

	/**
	 * Miniminum distance cell from unvisited cell
	 * 
	 * @returns Minimum distance cell
	 */
	minimunDistanceCell() : DijkstraCell {
		let cellToSearch = this._cells.filter((cell: DijkstraCell) => {
			return !cell.visited;
		});
		
		var minDistCell = cellToSearch[0];
		cellToSearch.forEach((cell: DijkstraCell) => {
			if (cell.dist < minDistCell.dist) {
				minDistCell = cell;
			}
		});

		return minDistCell;
	}

	remove(cell: DijkstraCell) {
		this._cells.splice(this._cells.indexOf(cell), 1);
	}

	getNeighborsOf(cell: DijkstraCell) : DijkstraCell[] {
		
		let neighbors: DijkstraCell[] = [];

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

	setCellFor(x: number, y: number, cell: DijkstraCell) {
		cell.x = x;
		cell.y = y;
		this._cells[this.getIndexFor(x, y)] = cell;
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

	getCellFor(x: number, y: number) : DijkstraCell {
        return this._cells[this.getIndexFor(x, y)];
	}

	
	
	dist(u: DijkstraCell, v: DijkstraCell) : number {
		console.log(Math.sqrt((u.x * v.x) + (u.y * v.y)));
		return Math.sqrt((u.x * v.x) + (u.y * v.y));
	}
}