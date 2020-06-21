import { Injectable } from '@angular/core';

import { Grid } from '../models/grid';
import { Cell } from '../models/cell';

// Should be move to models;
class DijkstraGrid {

	private _width: number = 0;
	private _height: number = 0;
	private _cells: DijkstraCell[] = [];

	constructor(width: number, height: number) {
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
			neighbors.push(this.getCellFor(cell.x - 1, cell.y));
		}

		if (cell.x < this._width - 1) {
			neighbors.push(this.getCellFor(cell.x + 1, cell.y));
		}

		if (cell.y > 0) {
			neighbors.push(this.getCellFor(cell.x, cell.y - 1));
		}

		if (cell.y < this._height - 1) {
			neighbors.push(this.getCellFor(cell.x, cell.y + 1));
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

class DijkstraCell {
	x: number = -1;
	y: number = -1;

	visited = false;
	dist: number = 0;
	prev: DijkstraCell = undefined;
}

@Injectable({
  	providedIn: 'root'
})
export class PathfindingService {

	constructor() { }

	// ----------------------------------------------------------------------------
	// @ Private methods
	// ----------------------------------------------------------------------------

// 	function Dijkstra(Graph, source):
		// 	2
		// 	3      create vertex set Q // Another grid with all set at state 'unvisited' called unvisitedSet
		// 	4
		// 	5      for each vertex v in Graph:           									  
		// 	6          dist[v] ← INFINITY     // Others cells must have a property 'tentativeDistance' = infinity             
		// 	7          prev[v] ← UNDEFINED    // The prev array is populated with a pointer to the "next-hop" node on the source graph to get the shortest route to the source   
		// 	8          add v to Q                      
		//    10      dist[source] ← 0          // Initial cell must have a property 'tentativeDistance' = 0              
		//    11      
		//    12      while Q is not empty:
		//    13          u ← vertex in Q with min dist[u]   u = currentNode // Get the smaller 'tentativeDistance' node
		//    14                                              
		//    15          remove u from Q 			// If currentNode = visited and remove it from unvisitedSet
		//    16          
		//    17          for each neighbor v of u:           // only v that are still in Q (x+1 x-1 y+1 y-1 dont make it diagonal)
		//    18              alt ← dist[u] + length(u, v)    
		//    19              if alt < dist[v]:               
		//    20                  dist[v] ← alt 
		//    21                  prev[v] ← u 
		//    22
		//    23      return dist[], prev[]

	dijkstraAlgorithm(grid: Grid) {
		// Get DijkstraGrid
		let dijkstraGrid = this.dijkstra(grid);
		// console.log(dijkstraGrid);
		// Filter to return a list of coordinates that correspond to the path
		let endCoordinates = grid.getEndCoordinates();

		let endDijkstraCell = dijkstraGrid.getCellFor(endCoordinates.x, endCoordinates.y);
		let coordinatesList: {
			x: number,
			y: number
		}[] = [{
			x: endDijkstraCell.x,
			y: endDijkstraCell.y
		}];

		let dijkstraCell = endDijkstraCell;

		while (grid.getCellFor(dijkstraCell.x, dijkstraCell.y).type != "start") {
			coordinatesList.push({
				x: dijkstraCell.prev.x,
				y: dijkstraCell.prev.y
			})
			dijkstraCell = dijkstraCell.prev;
		}

		console.log(coordinatesList);

		return coordinatesList;

	}

	/**
	 * Dijkstra alorithm
	 * 
	 * @param grid 
	 */
	private dijkstra(grid: Grid) : DijkstraGrid {

		// var src: Cell = grid.cells[grid.getStartIndex()];
		// var source = new DijkstraCell();


		/* SETUP */ /* VERIFIED */
		var dijkstraGrid = new DijkstraGrid(grid.width, grid.height);

		for (var y = 0; y < dijkstraGrid.height; y++) {

			for (var x = 0; x < dijkstraGrid.width; x++) {

				dijkstraGrid.getCellFor(x, y).dist = Infinity;
				dijkstraGrid.getCellFor(x, y).prev = undefined;

			}

		}

		let sourceCoordinates = grid.getStartCoordinates();
		let endCoordinates = grid.getEndCoordinates();
		dijkstraGrid.getCellFor(sourceCoordinates.x, sourceCoordinates.y).dist = 0;

		/* ALGORITHM LOOP */ /* NOT OK */
		var currentCell = new DijkstraCell();
		var i = 0;
		while (i < 255) {
			
			currentCell = dijkstraGrid.minimunDistanceCell();

			let neighbors = dijkstraGrid.getNeighborsOf(currentCell);
			
			// Pour tous les voisins
			neighbors.forEach((neighbour: DijkstraCell) => {

				let alt = currentCell.dist + 1;//dijkstraGrid.dist(currentCell, neighbour);

				if (alt < neighbour.dist) {
					neighbour.dist = alt;
					neighbour.prev = currentCell;
				}

			});
			
			currentCell.visited = true;

			i++;

		}

		return dijkstraGrid;


		// grid.cells.forEach((cell: Cell, index: number) => {
		// 	var v = new DijkstraCell();

		// 	v.dist = Infinity;
		// 	v.prev = undefined;

		// 	unvisited.grid.push(v);
		// });

		// source.dist = 0;

		// while (unvisited.grid.length != 0) {

		// 	let u: DijkstraCell = unvisited.minDistCell();

		// 	unvisited.grid.splice(unvisited.grid.indexOf(u), 1);

		// 	let neighbors: DijkstraCell[] = [];
		// 	neighbors.push(unvisited.getCellFor(u.x - 1, u.y));
		// 	neighbors.push(unvisited.getCellFor(u.x + 1, u.y));
		// 	neighbors.push(unvisited.getCellFor(u.x, u.y - 1));
		// 	neighbors.push(unvisited.getCellFor(u.x, u.y + 1));

		// 	neighbors.forEach((v: DijkstraCell) => {
		// 		let alt = u.dist + unvisited.dist(u, v);

		// 		if (alt < v.dist) {
		// 			v.dist = alt;
		// 			v.prev = u;
		// 		}
		// 	});

		// }

		// Problem because I have nothind to return
		// dist and prev should be array that contains ...

		// return dist , prev ;

	}
	  
	// ----------------------------------------------------------------------------
	// @ Public methods
	// ----------------------------------------------------------------------------
	
	/**
	 * Start algorithm for grid
	 * 
	 * @param algorithm 
	 * @param grid 
	 */
	start(algorithm: string, grid: Grid) {

		let list;
		switch (algorithm) {
			case "dijkstra":
				list = this.dijkstraAlgorithm(grid);
				break;
			default: 
				console.log("Can't find algorithm for name : " + algorithm);
		}
		return list;

		// let startIndex = grid.getStartIndex();
		// let endIndex = grid.getEndIndex();

		// === Dijkstra === //

		// Make another grid from grid size
		// It's the same but cell must have other properties

		// Another grid with all set at state 'unvisited' called unvisitedSet
		// Initial cell must have a property 'tentativeDistance' = 0
		// Others cells must have a property 'tentativeDistance' = infinity

		// Must have a currentNode = initialCell at the begining

		// * For currentNode : every unvisited neighbours (x+1 x-1 y+1 y-1 dont make it diagonal) compute 'tentativeDistance' to currentNode
		// Get the smaller 'tentativeDistance'

		// If currentNode = visited and remove it from unvisitedSet

		// When destinationNode = visited, done

		// Otherwise
			// Get the node with the smallest 'tentativeDistance' -> Current node and start again *




		



	}
}
