import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { InfoDialogComponent } from './info-dialog.component';

@NgModule({
	declarations: [
		InfoDialogComponent
	],
	imports: [
		CommonModule,
		MatButtonModule
	],
	exports: [
		InfoDialogComponent
	]
})
export class InfoDialogModule { }
