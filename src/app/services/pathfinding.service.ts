import { Injectable } from '@angular/core';
import { interval, Subject, Observable } from 'rxjs';

import { Grid } from '../models/grid';
import { Point } from '../models/point';
import { DijkstraGrid } from '../models/dijkstra/dijkstra-grid';
import { DijkstraCell } from '../models/dijkstra/dijkstra-cell';
import { AvailableAlgorithmType } from '../models/algorithm';
import { PathfindingResponse } from '../models/pathfinding';
import { AstarGrid } from '../models/astar/astar-grid';
import { AstarCell } from '../models/astar/astar-cell';
import { Cell, CellType } from '../models/cell';

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

		return coordinatesList.reverse();
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

			if (currentCell.dist == Infinity) {
				return new PathfindingResponse(
					visitedCells,
					[]
				);
			}

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
	 * Get astar solution
	 * 
	 * @param {Grid} grid 
	 * @param {AstarGrid} astarGrid 
	 * 
	 * @returns Path solution as a list of Point
	 */
	private getAstarSolution(grid: Grid, astarGrid: AstarGrid) : Point[] {

		/* GET PATH COORDINATES FROM ASTAR GRID */
		let endCoordinates = grid.getEndCoordinates();

		let endAstarCell = astarGrid.getCellFor(endCoordinates.x, endCoordinates.y);
		let coordinatesList: Point[] = [new Point(endAstarCell.x, endAstarCell.y)];

		let astarCell = endAstarCell;

		while (grid.getCellFor(astarCell.x, astarCell.y).type != "start") {
			coordinatesList.push(new Point(astarCell.prev.x, astarCell.prev.y));
			astarCell = astarCell.prev;
		}

		return coordinatesList.reverse();
	}

	/**
	 * Start astar algorithm
	 * 
	 * @param {Grid} grid 
	 */
	private startAstar(grid: Grid) : PathfindingResponse {

		let sourceCoordinates: Point = grid.getStartCoordinates();
		let destinationCoordinates: Point = grid.getEndCoordinates();

		/* SETUP */
		var astarGrid = new AstarGrid(grid.width, grid.height, grid);
		var visitedCells: Point[] = [];
		var openSet: AstarCell[] = [];

		for (var y = 0; y < astarGrid.height; y++) {

			for (var x = 0; x < astarGrid.width; x++) {

				astarGrid.getCellFor(x, y).dist = Infinity;
				astarGrid.getCellFor(x, y).prev = undefined;
				astarGrid.getCellFor(x, y).h = Point.distance(new Point(x, y), destinationCoordinates);
				astarGrid.getCellFor(x, y).destinationDist = astarGrid.getCellFor(x, y).h;

			}

		}

		astarGrid.getCellFor(sourceCoordinates.x, sourceCoordinates.y).dist = 0;
		openSet.push(JSON.parse(JSON.stringify(astarGrid.getCellFor(sourceCoordinates.x, sourceCoordinates.y))));

		/* ALGORITHM LOOP */
		var currentCell: AstarCell;

		while (openSet.length != 0) {

			currentCell = this.getAstarMinimumDistanceCell(openSet);

			if (grid.getCellFor(currentCell.x, currentCell.y).type == CellType.end) {
				return new PathfindingResponse(
					visitedCells,
					this.getAstarSolution(grid, astarGrid)
				);
			}

			
			let neighbors = astarGrid.getNeighborsOf(currentCell);
			
			neighbors.forEach((neighbour: AstarCell) => {
				
				let alt = currentCell.dist + 1;

				if (alt < neighbour.dist) {
					neighbour.prev = astarGrid.getCellFor(currentCell.x, currentCell.y);
					neighbour.dist = alt;
					neighbour.destinationDist = alt + neighbour.h;

					if (!this.doesListIncludeAstarCell(openSet, neighbour)) {
						openSet.push(
							JSON.parse(JSON.stringify(neighbour))
							);
					}
				}
				
			});

			astarGrid.getCellFor(currentCell.x, currentCell.y).visited = true;
			visitedCells.push(new Point(astarGrid.getCellFor(currentCell.x, currentCell.y).x, astarGrid.getCellFor(currentCell.x, currentCell.y).y));
			
			openSet.splice(openSet.indexOf(currentCell), 1);
		}

		return new PathfindingResponse(
			visitedCells,
			[]
		);

	}

	/**
	 * Does list include astar cell 
	 * 
	 * @param astarCellList 
	 * @param astarCell 
	 * 
	 * @returns True if the astarCell is included in astarCellList
	 */
	private doesListIncludeAstarCell(astarCellList: AstarCell[], astarCell: AstarCell) : boolean {

		var include = false;

		astarCellList.forEach((cell: AstarCell) => {
			if (cell.x == astarCell.x && cell.y == astarCell.y) {
				include = true;
			}
		});

		return include;
	}

	/**
	 * Get astar minimum distance cell from list
	 * 
	 * @param {AstarCell[]} list 
	 * 
	 * @returns AstarCell with minimum destination distance
	 */
	private getAstarMinimumDistanceCell(list: AstarCell[]) : AstarCell {

		var minDistCell = list[0];
		list.forEach((cell: AstarCell) => {

            if (cell.destinationDist < minDistCell.destinationDist) {
				minDistCell = cell;
            }
            
		});

		return minDistCell;

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
