import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

import { TemplatesDialogComponent } from './templates-dialog.component';

@NgModule({
	declarations: [
		TemplatesDialogComponent
	],
	imports: [
		CommonModule,

		// Material
		MatButtonModule,
		MatGridListModule
	],
	exports: [
		TemplatesDialogComponent
	]
})
export class TemplatesDialogModule { }
