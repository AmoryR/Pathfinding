
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

}