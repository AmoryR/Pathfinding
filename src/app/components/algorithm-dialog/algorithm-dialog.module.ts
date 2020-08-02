import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

import { AlgorithmDialogComponent } from './algorithm-dialog.component';

@NgModule({
	declarations: [
		AlgorithmDialogComponent
	],
	imports: [
		CommonModule,

		// Material
		MatButtonModule,
		MatGridListModule
	],
	exports: [
		AlgorithmDialogComponent
	]
})
export class AlgorithmDialogModule { }
