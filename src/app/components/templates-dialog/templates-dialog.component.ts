import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Grid } from 'src/app/models/grid';
import { CellType } from 'src/app/models/cell';

@Component({
	selector: 'app-templates-dialog',
	templateUrl: './templates-dialog.component.html',
	styleUrls: ['./templates-dialog.component.scss']
})
export class TemplatesDialogComponent implements OnInit {

	templates: Grid[] = [];

	constructor(
		private _dialogRef: MatDialogRef<TemplatesDialogComponent>,
	) { }

	ngOnInit() {

		let width = 16;
		let height = 16;

		let grid1 = new Grid(width, height);

		grid1.getCellFor(0, 0).type = CellType.start;
		grid1.getCellFor(15, 15).type = CellType.end;

		// Generate
		for (var x = 2; x < width; x += 2) {

			for (var y = 0; y < height; y++) {
				grid1.getCellFor(x, y).type = CellType.wall;
			}

			grid1.getCellFor(x, this.getRandomInt(height)).type = CellType.empty;
		}


		this.templates.push(grid1);

	}

	onSelectTemplate() {
		this._dialogRef.close(this.templates[0]);
	}

	onCancel() {
		this._dialogRef.close();
	}

	getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}

}
