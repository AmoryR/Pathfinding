import { Component, OnInit } from '@angular/core';

import { Grid } from 'src/app/models/grid';
import { Cell, CellType } from 'src/app/models/cell';

@Component({
	selector: 'pathfinding-grid',
	templateUrl: './pathfinding-grid.component.html',
	styleUrls: ['./pathfinding-grid.component.scss']
})
export class PathfindingGridComponent implements OnInit {

	grid: Grid;

	constructor() { }

	ngOnInit() {

		// Grid is 16 by 16 for now
		this.grid = new Grid(16, 16);

	}

	// ----------------------------------------------------------------------------
	// @ Public methods
	// ----------------------------------------------------------------------------

	// faire un model grid et un model cell
	// grid contient une liste de cell, width et height sont des paramètres du constructeur
	// cell contient des propriétés comme type (CellType : start, end, wall, empty)

	/**
	 * Select cell
	 * @param index 
	 */
	onSelectCell(cell: Cell) {
		
		cell.type = CellType.wall;
		
	}

}
