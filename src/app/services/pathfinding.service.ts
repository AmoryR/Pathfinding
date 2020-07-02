import { Injectable } from '@angular/core';
import { interval, Subject, Observable } from 'rxjs';

import { Grid } from '../models/grid';
import { Point } from '../models/point';
import { DijkstraGrid } from '../models/dijkstra/dijkstra-grid';
import { DijkstraCell } from '../models/dijkstra/dijkstra-cell';
import { PathfindingStatus, DijkstraResponse } from '../models/dijkstra/dijkstra-response';

@Injectable({
  	providedIn: 'root'
})
export class PathfindingService {

	constructor() { }

	// ----------------------------------------------------------------------------
	// @ Dijkstra methods
	// ----------------------------------------------------------------------------

	/**
	 * Dijkstra properties
	 */
	dijkstraStepper: Observable<number>;
	dijkstraResponse: DijkstraResponse;
	dijkstraSubject = new Subject<DijkstraResponse>();

	/**
	 * Emit disjkstra response
	 */
	private emitDijkstraReponse() {
		this.dijkstraSubject.next(this.dijkstraResponse);
	}

	/**
	 * Get dijkstra solution
	 * 
	 * @param {Grid} grid 
	 * @param {DijkstraGrid} dijkstraGrid 
	 * 
	 * @returns Path solution as a list of Point
	 */
	private getDijkstraSolution(grid: Grid, dijkstraGrid: DijkstraGrid) : Point[] {

		/* GET PATH COORDINATES FROM DIJKSTRA GRID */
		let endCoordinates = grid.getEndCoordinates();

		let endDijkstraCell = dijkstraGrid.getCellFor(endCoordinates.x, endCoordinates.y);
		let coordinatesList: Point[] = [new Point(endDijkstraCell.x, endDijkstraCell.y)];

		let dijkstraCell = endDijkstraCell;

		while (grid.getCellFor(dijkstraCell.x, dijkstraCell.y).type != "start") {
			coordinatesList.push(new Point(dijkstraCell.prev.x, dijkstraCell.prev.y));
			dijkstraCell = dijkstraCell.prev;
		}

		return coordinatesList;
	}

	/**
	 * Start dijkstra algorithm
	 * @param {Grid} grid 
	 */
	startDijkstra(grid: Grid) {

		/* SETUP */
		var dijkstraGrid = new DijkstraGrid(grid.width, grid.height, grid);

		for (var y = 0; y < dijkstraGrid.height; y++) {

			for (var x = 0; x < dijkstraGrid.width; x++) {

				dijkstraGrid.getCellFor(x, y).dist = Infinity;
				dijkstraGrid.getCellFor(x, y).prev = undefined;

			}

		}

		let sourceCoordinates = grid.getStartCoordinates();
		dijkstraGrid.getCellFor(sourceCoordinates.x, sourceCoordinates.y).dist = 0;

		this.dijkstraResponse = new DijkstraResponse(PathfindingStatus.inProgress, dijkstraGrid, []);
		this.emitDijkstraReponse();

		/* ALGORITHM LOOP */
		var currentCell = new DijkstraCell();

		this.dijkstraStepper = interval(5);
		var step = this.dijkstraStepper.subscribe(() => {

			// Run one step
			currentCell = dijkstraGrid.minimunDistanceCell();
	
			let neighbors = dijkstraGrid.getNeighborsOf(currentCell);
			
			neighbors.forEach((neighbour: DijkstraCell) => {

				let alt = currentCell.dist + 1; // Distance between 2 cells equal 1

				if (alt < neighbour.dist) {
					neighbour.dist = alt;
					neighbour.prev = currentCell;
				}

			});
			
			currentCell.visited = true;

			// Emit updates
			if (grid.getCellFor(currentCell.x, currentCell.y).type == "end") {
				this.dijkstraResponse.status = PathfindingStatus.done;
				this.dijkstraResponse.grid = dijkstraGrid;
				this.dijkstraResponse.solution = this.getDijkstraSolution(grid, dijkstraGrid);
				this.emitDijkstraReponse();

				step.unsubscribe();
			} else {
				this.dijkstraResponse.status = PathfindingStatus.inProgress;
				this.dijkstraResponse.grid = dijkstraGrid;
				this.dijkstraResponse.solution = [];
				this.emitDijkstraReponse();
			}

		});

	}
	  
	// ----------------------------------------------------------------------------
	// @ Public methods
	// ----------------------------------------------------------------------------
	
	/**
	 * Start algorithm for grid
	 * 
	 * @param algorithm 
	 * @param grid 
	 * 
	 * @returns List of points solved by a pathfinding algorithm
	 */
	start(algorithm: string, grid: Grid) {

		switch (algorithm) {
			case "dijkstra":
				this.startDijkstra(grid);
				break;
			default: 
				console.log("Can't find algorithm for name : " + algorithm);
		}

	}
}
