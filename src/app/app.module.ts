import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToolsbarModule } from './components/toolsbar/toolsbar.module';
import { PathfindingGridModule } from './components/pathfinding-grid/pathfinding-grid.module';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,

		ToolsbarModule,
		PathfindingGridModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
