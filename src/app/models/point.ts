
export class Point {

    private _x: number = 0;
    private _y: number = 0;

    constructor(x?: number, y?: number) {
        this._x = x;
        this._y = y;
    }

    // ----------------------------------------------------------------------------
	// @ Mutator methods
	// ----------------------------------------------------------------------------

    get x() : number { return this._x; }
    set x(value: number) { this._x = value; }

    get y() : number { return this._y; }
    set y(value: number) { this._y = value; }

    // ----------------------------------------------------------------------------
	// @ Static methods
    // ----------------------------------------------------------------------------
    
    /**
	 * Get distance between 2 points
     * 
	 * @param point1 
	 * @param point2 
	 */
    static distance(point1: Point, point2: Point) : number {
		return Math.sqrt( Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
	}

}