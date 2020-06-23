import { DijkstraGrid } from './dijkstra-grid';
import { Point } from '../point';

export enum PathfindingStatus {
	inProgress = "inProgress",
	done = "done"
}

export class DijkstraResponse {
	status: PathfindingStatus;
	grid: DijkstraGrid;
	solution: Point[];

	constructor(status: PathfindingStatus, grid: DijkstraGrid, solution: Point[]) {
		this.status = status;
		this.grid = grid;
		this.solution = solution;
	}
}