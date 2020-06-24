import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { TemplatesDialogComponent } from '../templates-dialog/templates-dialog.component';
import { TemplatesDialogModule } from '../templates-dialog/templates-dialog.module';

import { PathfindingGridComponent } from './pathfinding-grid.component';

@NgModule({
	declarations: [
		PathfindingGridComponent
	],
	imports: [
		CommonModule,

		TemplatesDialogModule,

		// Material
		MatButtonModule,
		MatDialogModule
	],
	exports: [
		PathfindingGridComponent
	],
	entryComponents: [
		TemplatesDialogComponent
	]
})
export class PathfindingGridModule { }
