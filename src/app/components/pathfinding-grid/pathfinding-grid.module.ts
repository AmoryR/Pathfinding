import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { PathfindingGridComponent } from './pathfinding-grid.component';

@NgModule({
	declarations: [
		PathfindingGridComponent
	],
	imports: [
		CommonModule,

		// Material
		MatButtonModule
	],
	exports: [
		PathfindingGridComponent
	]
})
export class PathfindingGridModule { }
