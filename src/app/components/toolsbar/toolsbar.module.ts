import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ToolsbarComponent } from './toolsbar.component';


@NgModule({
	declarations: [
		ToolsbarComponent
	],
	imports: [
		CommonModule,

		// Material
		MatToolbarModule,
		MatButtonModule,
		MatIconModule
	],
	exports: [
		ToolsbarComponent
	]
})
export class ToolsbarModule { }
