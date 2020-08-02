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

	templateNames: string[] = [
		"Template 1",
		"Template 2",
		"Template 3",
		"Template 4",
		"Template 5",
		"Template 6"
	];
	templates: Grid[] = [
		new Grid(10, 10),
		new Grid(10, 10),
		new Grid(10, 10),
		new Grid(10, 10),
		new Grid(10, 10),
		new Grid(10, 10)
	];

	constructor(
		private _dialogRef: MatDialogRef<TemplatesDialogComponent>,
	) { }

	ngOnInit() {

	}

	/**
	 * Select
	 */
	onSelect(templateName: string) {
		this._dialogRef.close(
			this.templates[this.templateNames.indexOf(templateName)]
		);
	}

	/**
	 * Cancel
	 */
	onCancel() {
		this._dialogRef.close();
	}

}
