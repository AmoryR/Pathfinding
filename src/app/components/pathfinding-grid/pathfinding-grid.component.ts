import { Component, OnInit } from '@angular/core';

import { Grid } from 'src/app/models/grid';
import { Cell, CellType } from 'src/app/models/cell';

import { PathfindingService } from 'src/app/services/pathfinding.service';

@Component({
	selector: 'pathfinding-grid',
	templateUrl: './pathfinding-grid.component.html',
	styleUrls: ['./pathfinding-grid.component.scss']
})
export class PathfindingGridComponent implements OnInit {

	grid: Grid;

	constructor(
		private _pathfindingService: PathfindingService
	) { }

	ngOnInit() {

		// Grid is 16 by 16 for now
		this.grid = new Grid(16, 16);
		this.grid.getCellFor(1, 1).type = CellType.start;
		this.grid.getCellFor(13, 8).type = CellType.end;

	}

	// ----------------------------------------------------------------------------
	// @ Public methods
	// ----------------------------------------------------------------------------

	/**
	 * Select cell
	 * @param index 
	 */
	onSelectCell(cell: Cell) {

		if (cell.type == "start" || cell.type == "end")
			return;
		
		cell.type = CellType.wall;
		
	}

	/**
	 * Start path finding algorithme
	 */
	state : string = "ready";
	onStartPathfindingAlgorithme() {

		if (this.state == "ready") {

			let list = this._pathfindingService.start("dijkstra", this.grid);
	
			list.forEach(element => {
	
				let cell = this.grid.getCellFor(element.x, element.y);
				if (cell.type != "start" && cell.type != "end") {
	
					cell.type = CellType.path;
				}
			});

			this.state = "done";
		} else if (this.state == "done") {

			this.grid.cells.forEach((cell: Cell) => {
				cell.type = CellType.empty;
			})

			this.grid.getCellFor(this.getRandomInt(16), this.getRandomInt(16)).type = CellType.start;
			this.grid.getCellFor(this.getRandomInt(16), this.getRandomInt(16)).type = CellType.end;

			this.state = "ready";

		}
	}

	getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}

}
