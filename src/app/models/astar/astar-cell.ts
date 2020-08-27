
export class AstarCell {
	x: number = -1;
	y: number = -1;
	visited = false;
    dist: number = 0;
    destinationDist: number = 0;
    h: number = 0;
    prev: AstarCell = undefined;
    
    constructor() {}
}