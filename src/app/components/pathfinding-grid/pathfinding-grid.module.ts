import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PathfindingGridComponent } from './pathfinding-grid.component';

@NgModule({
	declarations: [
		PathfindingGridComponent
	],
	imports: [
		CommonModule
	],
	exports: [
		PathfindingGridComponent
	]
})
export class PathfindingGridModule { }
