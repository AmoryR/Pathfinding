import { Component, OnInit, Renderer2, Host, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { trigger, transition, style, sequence, group, animate } from '@angular/animations';

import { Grid } from 'src/app/models/grid';
import { Cell, CellType } from 'src/app/models/cell'; 
import { DijkstraCell } from 'src/app/models/dijkstra/dijkstra-cell';
import { Point } from 'src/app/models/point';
import { PathfindingResponse } from 'src/app/models/pathfinding';

import { PathfindingService } from 'src/app/services/pathfinding.service';
import { ToolsbarService } from 'src/app/services/toolsbar.service';

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
				style({ transform: 'scale(1.2)' }),
				animate('600ms ease', style({ transform: 'scale(1)' }))
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
				style({ transform: 'scale(0)', background: "#6d99a2" }),

				sequence([
					animate('1000ms ease', style({ transform: 'scale(1.1)', background: "#02808f" })),
					animate('500ms ease', style({ transform: 'scale(1)', background: "#124c60" }))
				])

			]),
			transition(':leave', [
			  	animate('200ms', style({ transform: 'scale(0)' }))
			])
		])
	]
})
export class PathfindingGridComponent implements OnInit {

	width: number = 0;
	height: number = 0;

	/**
	 * Tools bar subscription
	 */
	selectTemplatesSubscription: Subscription;
	selectAlgorithmSubscription: Subscription;
	showInfoSubscription: Subscription;

	cellSize = 30; // $cell-size
	grid: Grid = new Grid(0, 0);
	gridElementReference: HTMLElement;
	state: string = ""; // not-started | in-progress | done

	selectedAlgorithm: string = "";
	dijkstraSubscription: Subscription;
	astarSubscription: Subscription;

	constructor(
		private _matDialog: MatDialog,
		private _renderer: Renderer2,
		private _pathfindingService: PathfindingService,
		private _toolsbarService: ToolsbarService
	) {}

	ngOnInit() {

		/**
		 * Component initialization
		 */

		// if (this.width == undefined || this.height == undefined) {
		// 	return;
		// }
		
		// this.grid = new Grid(this.width, this.height);
		// this.grid.getCellFor(5, Math.floor(this.height / 2)).type = CellType.start;
		// this.grid.getCellFor(this.width - 6, Math.floor(this.height / 2)).type = CellType.end;

		// this.gridElementReference = document.getElementById("pathfinding-grid");
		// this._renderer.setStyle(this.gridElementReference, "grid-template-columns", "repeat(" + this.width + ", " + this.cellSize + "px)");

		this.state = "not-started";

	}

	// ----------------------------------------------------------------------------
	// @ Private methods
	// ----------------------------------------------------------------------------

	// ----------------------------------------------------------------------------
	// @ Public methods
	// ----------------------------------------------------------------------------

	setUpGrid(width: number, height: number) {

		this.width = width;
		this.height = height;

		this.grid = new Grid(width, height);
		this.grid.getCellFor(10, Math.floor(this.height / 2)).type = CellType.start;
		this.grid.getCellFor(this.width - 11, Math.floor(this.height / 2)).type = CellType.end;

		this.gridElementReference = document.getElementById("pathfinding-grid");
		this._renderer.setStyle(this.gridElementReference, "grid-template-columns", "repeat(" + width + ", " + this.cellSize + "px)");

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

			if (cell.type == CellType.end) {
				return;
			}

			let previousCell = this.grid.getCellFor(this.previousStartPosition.x, this.previousStartPosition.y);
			previousCell.type = CellType.empty;

			this.previousStartPosition.x = xCell;
			this.previousStartPosition.y = yCell;
			cell.type = CellType.start;

			return;
		}

		// End selected
		if (this.endSelected) {

			if (cell.type == CellType.start) {
				return;
			}

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
	startPathfindingAlgorithme() {

		if (this.state == "not-started") {
			let pathfindingResponse = this._pathfindingService.start(this.grid);

			// Run animation for visited then solution;
			if (pathfindingResponse.solutionCells.length != 0) {

				this.state = 'in-progress';

				this.animateVisitedCells(pathfindingResponse.visitedCells).then(() => {
					this.animateSolutionCells(pathfindingResponse.solutionCells).then(() => {
						this.state = 'done';
					});
				});

			} else {

				this.state = 'in-progress';

				this.animateVisitedCells(pathfindingResponse.visitedCells).then(() => {
					this.state = 'done';
				});

			}

		} else if (this.state == 'in-progress') {

			// Cancel

		} else if (this.state == 'done') {
			this.onClearGrid();
		}

	}

	/**
	 * Animate visited cells
	 * 
	 * @param visitedCells 
	 */
	animateVisitedCells(visitedCells: Point[]) {
		
		return new Promise((resolve) => {

			visitedCells.forEach((position: Point, index: number) => {
			
				setTimeout(() => {
	
					let cell = this.grid.getCellFor(position.x, position.y);
	
					if (cell.type != "start" && cell.type != "end") {
						cell.type = CellType.visited;
					}

					if (index == visitedCells.length - 1) {
						resolve();
					}
	
				}, index * 20);
	
			});

		});

	}

	/**
	 * Animate solution cells
	 * 
	 * @param solutionCells 
	 */
	animateSolutionCells(solutionCells: Point[]) {
		
		return new Promise((resolve) => {

			solutionCells.forEach((position: Point, index: number) => {
			
				setTimeout(() => {
	
					let cell = this.grid.getCellFor(position.x, position.y);
	
					if (cell.type != "start" && cell.type != "end") {
						cell.type = CellType.path;
					}

					if (index == solutionCells.length - 1) {
						resolve();
					}
	
				}, index * 100);
	
			});

		});
		

	}

	/**
	 * Clear grid
	 */
	onClearGrid() {
		this.grid.cells.forEach((cell: Cell) => {
			cell.type = CellType.empty;
		})

		this.grid.getCellFor(10, Math.floor(this.height / 2)).type = CellType.start;
		this.grid.getCellFor(this.width - 11, Math.floor(this.height / 2)).type = CellType.end;

		this.state = "not-started";
	}

}
