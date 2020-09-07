import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorialDialogComponent } from './tutorial-dialog.component';

@NgModule({
	declarations: [
		TutorialDialogComponent
	],
	imports: [
		CommonModule
	],
	exports: [
		TutorialDialogComponent
	]
})
export class TutorialDialogModule { }
