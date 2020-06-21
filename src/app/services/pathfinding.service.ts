import { Injectable } from '@angular/core';

import { Grid } from '../models/grid';
import { Point } from '../models/point';
import { DijkstraGrid } from '../models/dijkstra/dijkstra-grid';
import { DijkstraCell } from '../models/dijkstra/dijkstra-cell';

@Injectable({
  	providedIn: 'root'
})
export class PathfindingService {

	constructor() { }

	// ----------------------------------------------------------------------------
	// @ Dijkstra methods
	// ----------------------------------------------------------------------------

	/**
	 * Get path from dijkstra algorithm
	 * 
	 * @param {Grid} grid 
	 * 
	 * @returns List of point that corresponds to path
	 */
	private getPathFromDijkstraAlgorithm(grid: Grid) : Point[] {
		
		/* SOLVE WITH DIJKSTRA'S ALGORITHM */
		let dijkstraGrid = this.dijkstra(grid);
		
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
	 * Dijkstra algorithm
	 * 
	 * @param {Grid} grid
	 * 
	 * @returns DijkstraGrid solved by Dijkstra's algorithm
	 */
	private dijkstra(grid: Grid) : DijkstraGrid {

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

		/* ALGORITHM LOOP */
		var currentCell = new DijkstraCell();
		var i = 0;
		while (i < 255) { // Find how to stop the loop
			
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

			i++;

		}

		return dijkstraGrid;

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
	start(algorithm: string, grid: Grid) : Point[] {

		let pathList: Point[] = [];

		switch (algorithm) {
			case "dijkstra":
				pathList = this.getPathFromDijkstraAlgorithm(grid);
				break;
			default: 
				console.log("Can't find algorithm for name : " + algorithm);
		}

		return pathList;

	}
}
