import { Injectable } from '@angular/core';
import { interval, Subject, Observable } from 'rxjs';

import { Grid } from '../models/grid';
import { Point } from '../models/point';
import { DijkstraGrid } from '../models/dijkstra/dijkstra-grid';
import { DijkstraCell } from '../models/dijkstra/dijkstra-cell';
import { PathfindingStatus, DijkstraResponse } from '../models/dijkstra/dijkstra-response';
import { AvailableAlgorithmType } from '../models/algorithm';
import { PathfindingResponse } from '../models/pathfinding';

@Injectable({
  	providedIn: 'root'
})
export class PathfindingService {

	private _selectedAlgorithm = AvailableAlgorithmType.Dijkstra;
	get selectedAlgorithm() { return this._selectedAlgorithm; }
	set selectedAlgorithm(value: AvailableAlgorithmType) { this._selectedAlgorithm = value; }

	constructor() { }

	// ----------------------------------------------------------------------------
	// @ Dijkstra methods
	// ----------------------------------------------------------------------------

	/**
	 * Put this in a service like 'DijkstaService'
	 * 
	 * Each algorithm service should implement a class 'AlgoritmService'
	 * with a method 'startSearching(grid: Grid) : PathfindingResponse' implemented ?
	 *
	 * Private methods are added if needed
	 */

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
	 * 
	 * @param {Grid} grid 
	 */
	private startDijkstra(grid: Grid) : PathfindingResponse {

		/* SETUP */
		var dijkstraGrid = new DijkstraGrid(grid.width, grid.height, grid);
		var visitedCells: Point[] = [];

		for (var y = 0; y < dijkstraGrid.height; y++) {

			for (var x = 0; x < dijkstraGrid.width; x++) {

				dijkstraGrid.getCellFor(x, y).dist = Infinity;
				dijkstraGrid.getCellFor(x, y).prev = undefined;

			}

		}

		let sourceCoordinates = grid.getStartCoordinates();
		dijkstraGrid.getCellFor(sourceCoordinates.x, sourceCoordinates.y).dist = 0;

		/* ALGORITHM LOOP */
		var currentCell = dijkstraGrid.minimunDistanceCell();

		while (grid.getCellFor(currentCell.x, currentCell.y).type != "end") {

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
			visitedCells.push(new Point(currentCell.x, currentCell.y));
		}

		return new PathfindingResponse(
			visitedCells,
			this.getDijkstraSolution(grid, dijkstraGrid)
		);
	}

	// ----------------------------------------------------------------------------
	// @ Astar methods
	// ----------------------------------------------------------------------------

	/**
	 * Start astar algorithm
	 * 
	 * @param {Grid} grid 
	 */
	private startAstar(grid: Grid) : PathfindingResponse {
		return undefined;
	}
	  
	// ----------------------------------------------------------------------------
	// @ Public methods
	// ----------------------------------------------------------------------------
	
	/**
	 * Start algorithm for grid
	 * 
	 * @param grid  
	 * 
	 * @returns Pathfing response that contains list of visited and solution cells coordinates
	 */
	start(grid: Grid) : PathfindingResponse {

		switch (this._selectedAlgorithm) {

			case AvailableAlgorithmType.Dijkstra:
				return this.startDijkstra(grid);
			case AvailableAlgorithmType.Astar:
				return this.startAstar(grid);
			default:
				console.error("Can't find algorithm for name : " + this._selectedAlgorithm);
				return undefined;
		}

	}
}
