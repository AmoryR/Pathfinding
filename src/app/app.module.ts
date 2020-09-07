import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PathfindingGridModule } from './components/pathfinding-grid/pathfinding-grid.module';

import { TutorialDialogComponent } from './components/tutorial-dialog/tutorial-dialog.component';
import { TutorialDialogModule } from './components/tutorial-dialog/tutorial-dialog.module';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,

		MatIconModule,
		MatTabsModule,
		MatGridListModule,

		PathfindingGridModule,
		TutorialDialogModule
	],
	entryComponents: [
		TutorialDialogComponent
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
