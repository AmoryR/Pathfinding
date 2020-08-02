import { Point } from './point';

export class PathfindingResponse {
	visitedCells: Point[] = [];
	solutionCells: Point[] = [];
	
	constructor(visitedCells: Point[], solutionCells: Point[]) {
		this.visitedCells = visitedCells;
		this.solutionCells = solutionCells;
	}
}