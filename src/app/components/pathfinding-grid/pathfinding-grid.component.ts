import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { trigger, transition, style, sequence, group, animate } from '@angular/animations';

import { Grid } from 'src/app/models/grid';
import { Cell, CellType } from 'src/app/models/cell';
import { PathfindingStatus, DijkstraResponse } from 'src/app/models/dijkstra/dijkstra-response'; 
import { DijkstraCell } from 'src/app/models/dijkstra/dijkstra-cell';

import { TemplatesDialogComponent } from '../templates-dialog/templates-dialog.component';

import { PathfindingService } from 'src/app/services/pathfinding.service';
import { ToolsbarService } from 'src/app/services/toolsbar.service';
import { Point } from 'src/app/models/point';

@Component({
	selector: 'pathfinding-grid',
	templateUrl: './pathfinding-grid.component.html',
	styleUrls: ['./pathfinding-grid.component.scss'],
	animations: [

		// Start or end
		trigger('startEndAnimation', [
			transition(':enter', [
				style({ transform: 'scale(0.5)'}),

				sequence([
					animate('200ms', style({ transform: 'scale(1.2)' })),
					animate('10ms', style({ transform: 'scale(1)' }))
				])

			]),
			transition(':leave', [
				animate('200ms', style({ transform: 'scale(0)' }))
			])
		]),

		// Path
		trigger('pathAnimation', [
			transition(':enter', [
				style({ opacity: 0 }),
				  
			  	// sequence([
					// animate('100ms', style({ transform: 'scale(1.2)' })),
					// animate('400ms', style({ transform: 'scale(0.8)' })),
					animate('1000ms', style({ opacity: 1 }))
					// animate('50ms', style({ opacity: 1 }))
				// ])
			]),
			transition(':leave', [
			  	animate('200ms', style({ transform: 'scale(0)' }))
			])
		]),

		// Wall
		trigger('wallAnimation', [
			transition(':enter', [
				style({ transform: 'scale(0)' }),
				  
			  	sequence([
					animate('100ms', style({ transform: 'scale(1.2)' })),
					animate('50ms', style({ transform: 'scale(1)' }))
				])
			]),
			transition(':leave', [
			  	animate('200ms', style({ transform: 'scale(0)' }))
			])
		]),

		// Visited
		trigger('visitedAnimation', [
			transition(':enter', [
				style({ transform: 'scale(0)', background: "blue" }),

				sequence([
					animate('1000ms', style({ transform: 'scale(1.1)', background: "green" })),
					animate('500ms', style({ transform: 'scale(1)', background: "cyan" }))
				])

			])
		])
	]
})
export class PathfindingGridComponent implements OnInit {

	/**
	 * Tools bar subscription
	 */
	selectTemplatesSubscription: Subscription;

	cellSize = 20; // $cell-size
	widthGrid: number = 0;
	heightGrid: number = 0;
	grid: Grid;
	gridElementReference: HTMLElement;
	state: string = ""; // not-started | in-progress | done

	dijkstraSubscription: Subscription;

	constructor(
		private _matDialog: MatDialog,
		private _renderer: Renderer2,
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

		this.widthGrid = 48;
		this.heightGrid = 32;

		this.grid = new Grid(this.widthGrid, this.heightGrid);
		this.grid.getCellFor(1, 1).type = CellType.start;
		this.grid.getCellFor(this.widthGrid - 2, this.heightGrid - 2).type = CellType.end;

		this.gridElementReference = document.getElementById("pathfinding-grid");
		this._renderer.setStyle(this.gridElementReference, "grid-template-columns", "repeat(" + this.widthGrid + ", " + this.cellSize + "px)");

		this.state = "not-started";
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
	// @ Grid methods
	// ----------------------------------------------------------------------------

	previousStartPosition: Point = new Point();
	startSelected = false;

	previousEndPosition: Point = new Point();
	endSelected = false;

	draw = false;
	undraw = false;

	/**
	 * Mouse down on grid
	 * 
	 * @param $event 
	 */
	mouseDown($event: MouseEvent) {

		if (this.state == "in-progress" || this.state == "done") {
			return;
		}

		let gridRect = this.gridElementReference.getBoundingClientRect();
		let xPositionOnGrid = $event.x - gridRect.left;
		let yPositionOnGrid = $event.y - gridRect.top;
		
		let xCell = Math.floor(xPositionOnGrid / this.cellSize);
		let yCell = Math.floor(yPositionOnGrid / this.cellSize);
		let cell = this.grid.getCellFor(xCell, yCell);

		// Select start
		if (cell.type == "start") {
			this.startSelected = true;
			this.previousStartPosition = new Point(xCell, yCell);
			return;
		}

		// Select end
		if (cell.type == "end") {
			this.endSelected = true;
			this.previousEndPosition = new Point(xCell, yCell);
			return;
		}

		// Place a wall or clear wall
		if (cell.type != "wall") {
			cell.type = CellType.wall;

			this.draw = true;
			this.undraw = false;
		} else if (cell.type == "wall") {
			cell.type = CellType.empty;

			this.draw = false;
			this.undraw = true;
		}

	}

	/**
	 * Mouse move on grid
	 * 
	 * @param $event 
	 */
	mouseMove($event: MouseEvent) {

		if (this.state == "in-progress" || this.state == "done") {
			return;
		}

		if (!this.draw && !this.undraw && !this.startSelected && !this.endSelected) {
			return;
		}

		let gridRect = this.gridElementReference.getBoundingClientRect();
		let xPositionOnGrid = $event.x - gridRect.left;
		let yPositionOnGrid = $event.y - gridRect.top;
		
		let xCell = Math.floor(xPositionOnGrid / this.cellSize);
		let yCell = Math.floor(yPositionOnGrid / this.cellSize);
		let cell = this.grid.getCellFor(xCell, yCell);

		// Start selected
		if (this.startSelected) {

			let previousCell = this.grid.getCellFor(this.previousStartPosition.x, this.previousStartPosition.y);
			previousCell.type = CellType.empty;

			this.previousStartPosition.x = xCell;
			this.previousStartPosition.y = yCell;
			cell.type = CellType.start;

			return;
		}

		// End selected
		if (this.endSelected) {

			let previousCell = this.grid.getCellFor(this.previousEndPosition.x, this.previousEndPosition.y);
			previousCell.type = CellType.empty;

			this.previousEndPosition.x = xCell;
			this.previousEndPosition.y = yCell;
			cell.type = CellType.end;

			return;
		}

		// Draw or undraw walls
		if (cell.type != "wall" && cell.type != "start" && cell.type != "end" && this.draw) {
			cell.type = CellType.wall;
		} else if (cell.type == "wall" && this.undraw) {
			cell.type = CellType.empty;
		}
	}

	/**
	 * Mouse up on grid
	 * 
	 * @param $event 
	 */
	mouseUp($event: MouseEvent) {

		if (this.state == "in-progress" || this.state == "done") {
			return;
		}

		if (this.startSelected) {
			this.startSelected = false;
		}

		if (this.endSelected) {
			this.endSelected = false;
		}

		this.draw = false;
		this.undraw = false;
	}

	// ----------------------------------------------------------------------------
	// @ Public methods
	// ----------------------------------------------------------------------------

	/**
	 * Start path finding algorithme
	 */
	onStartPathfindingAlgorithme() {

		if (this.state == "not-started") {

			this.dijkstraSubscription = this._pathfindingService.dijkstraSubject.subscribe((dijkstraResponse: DijkstraResponse) => {
				
				/* DONE SO I GET THE DIJKSTRA SOLUTION */
				if (dijkstraResponse.status == PathfindingStatus.done) {

					if (dijkstraResponse.solution.length == 0) {
						console.log("This is not normal I think")
						return;
					}

					this.revealPathSolution(dijkstraResponse.solution);

				/* SHOW VISITED CELLS */
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

			this.state = "in-progress";
			this._pathfindingService.start("dijkstra", this.grid);

		}

	}

	/**
	 * Reveal path solution on grid
	 * 
	 * @param {Point[]} solution 
	 */
	revealPathSolution(solution: Point[]) {

		let solutionLength = solution.length;
		let solutionIndex = solutionLength - 1;

		let interval = setInterval(() => {

			let cell = this.grid.getCellFor(solution[solutionIndex].x, solution[solutionIndex].y);
			if (cell.type != "start" && cell.type != "end") {
				cell.type = CellType.path;
			}

			solutionIndex--;

			if (solutionIndex == 0) {
				this.state = "done";
				clearInterval(interval);
			}

		}, 100);

	}

	/**
	 * Clear grid
	 */
	onClearGrid() {
		this.grid.cells.forEach((cell: Cell) => {
			cell.type = CellType.empty;
		})

		this.grid.getCellFor(1, 1).type = CellType.start;
		this.grid.getCellFor(this.widthGrid - 2, this.heightGrid - 2).type = CellType.end;

		this.state = "not-started";
	}

}
