import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolsbarComponent } from './toolsbar.component';

import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
	declarations: [
		ToolsbarComponent
	],
	imports: [
		CommonModule,

		// Material
		MatToolbarModule
	],
	exports: [
		ToolsbarComponent
	]
})
export class ToolsbarModule { }
