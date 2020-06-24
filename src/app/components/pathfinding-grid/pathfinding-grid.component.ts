import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { Grid } from 'src/app/models/grid';
import { Cell, CellType } from 'src/app/models/cell';
import { PathfindingStatus, DijkstraResponse } from 'src/app/models/dijkstra/dijkstra-response'; 
import { DijkstraCell } from 'src/app/models/dijkstra/dijkstra-cell';

import { TemplatesDialogComponent } from '../templates-dialog/templates-dialog.component';

import { PathfindingService } from 'src/app/services/pathfinding.service';
import { ToolsbarService } from 'src/app/services/toolsbar.service';

@Component({
	selector: 'pathfinding-grid',
	templateUrl: './pathfinding-grid.component.html',
	styleUrls: ['./pathfinding-grid.component.scss']
})
export class PathfindingGridComponent implements OnInit {

	/**
	 * Tools bar subscription
	 */
	selectTemplatesSubscription: Subscription;

	grid: Grid;

	dijkstraSubscription: Subscription;

	constructor(
		private _matDialog: MatDialog,
		private _pathfindingService: PathfindingService,
		private _toolsbarService: ToolsbarService
	) { }

	ngOnInit() {

		/**
		 * Tools bar subscription
		 */

		this.selectTemplatesSubscription = this._toolsbarService.selectTemplateSubject.subscribe(() => {
			// this.openTemplatesDialog();
		});

		// Grid is 16 by 16 for now
		this.grid = new Grid(16, 16);
		this.grid.getCellFor(0, 0).type = CellType.start;
		this.grid.getCellFor(15, 15).type = CellType.end;

	}

	// ----------------------------------------------------------------------------
	// @ Private methods
	// ----------------------------------------------------------------------------

	/**
	 * Open templates dialog
	 */
	private openTemplatesDialog() {

		// Open dialog
		const dialogRef = this._matDialog.open(TemplatesDialogComponent, {
			width: '800px'
		});

		// Close dialog
		dialogRef.afterClosed().subscribe((grid: Grid) => {
			if (!grid){
				return;
			}

			this.grid = grid;
		});

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
		
		if (cell.type == "wall")
			cell.type = CellType.empty;
		else
			cell.type = CellType.wall;
		
	}

	/**
	 * Start path finding algorithme
	 */
	state : string = "ready";
	onStartPathfindingAlgorithme() {

		if (this.state == "ready") {

			this.dijkstraSubscription = this._pathfindingService.dijkstraSubject.subscribe((dijkstraResponse: DijkstraResponse) => {
				
				if (dijkstraResponse.status == PathfindingStatus.done) {

					if (dijkstraResponse.solution.length == 0) {
						console.log("This is not normal I think")
						return;
					}

					dijkstraResponse.solution.forEach(element => {
	
						let cell = this.grid.getCellFor(element.x, element.y);
						if (cell.type != "start" && cell.type != "end") {
			
							cell.type = CellType.path;
						}
					});

					this.state = "done";

				} else {

					for (var y = 0; y < dijkstraResponse.grid.height; y++) {

						for (var x = 0; x < dijkstraResponse.grid.width; x++) {
			
							let currentCell: DijkstraCell = dijkstraResponse.grid.getCellFor(x, y);
			
							if (currentCell.visited) {
								var gridCell = this.grid.getCellFor(x, y);
	
								if (gridCell.type != "start" && gridCell.type != "end" && gridCell.type != "wall") {
									this.grid.getCellFor(x, y).type = CellType.visited;
								}
							}
						}
			
					}

				}

			});

			this._pathfindingService.start("dijkstra", this.grid);
	
			// list.forEach(element => {
	
			// 	let cell = this.grid.getCellFor(element.x, element.y);
			// 	if (cell.type != "start" && cell.type != "end") {
	
			// 		cell.type = CellType.path;
			// 	}
			// });

			// this.state = "done";
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
