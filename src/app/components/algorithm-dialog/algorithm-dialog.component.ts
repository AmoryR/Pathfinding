import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-algorithm-dialog',
	templateUrl: './algorithm-dialog.component.html',
	styleUrls: ['./algorithm-dialog.component.scss']
})
export class AlgorithmDialogComponent implements OnInit {

	constructor(
		private _dialogRef: MatDialogRef<AlgorithmDialogComponent>
	) { }

	ngOnInit() {
	}

	// ----------------------------------------------------------------------------
	// @ Public methods
	// ----------------------------------------------------------------------------

	/**
	 * Select
	 */
	onSelect(algorithm: string) {
		this._dialogRef.close(algorithm);
	}

	/**
	 * Cancel
	 */
	onCancel() {
		this._dialogRef.close();
	}

}
