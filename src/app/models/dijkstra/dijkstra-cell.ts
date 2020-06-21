
// Maybe cleaner
export class DijkstraCell {
	x: number = -1;
	y: number = -1;
	visited = false;
	dist: number = 0;
	prev: DijkstraCell = undefined;
}