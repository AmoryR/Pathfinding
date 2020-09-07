import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { PathfindingGridComponent } from './pathfinding-grid.component';

@NgModule({
	declarations: [
		PathfindingGridComponent
	],
	imports: [
		CommonModule,

		// Material
		MatButtonModule,
		MatDialogModule
	],
	exports: [
		PathfindingGridComponent
	]
})
export class PathfindingGridModule { }
