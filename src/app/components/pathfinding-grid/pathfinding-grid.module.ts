import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { TemplatesDialogComponent } from '../templates-dialog/templates-dialog.component';
import { TemplatesDialogModule } from '../templates-dialog/templates-dialog.module';

import { AlgorithmDialogComponent } from '../algorithm-dialog/algorithm-dialog.component';
import { AlgorithmDialogModule } from '../algorithm-dialog/algorithm-dialog.module';

import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { InfoDialogModule } from '../info-dialog/info-dialog.module';

import { PathfindingGridComponent } from './pathfinding-grid.component';

@NgModule({
	declarations: [
		PathfindingGridComponent
	],
	imports: [
		CommonModule,

		TemplatesDialogModule,
		AlgorithmDialogModule,
		InfoDialogModule,

		// Material
		MatButtonModule,
		MatDialogModule
	],
	exports: [
		PathfindingGridComponent
	],
	entryComponents: [
		TemplatesDialogComponent,
		AlgorithmDialogComponent,
		InfoDialogComponent
	]
})
export class PathfindingGridModule { }
