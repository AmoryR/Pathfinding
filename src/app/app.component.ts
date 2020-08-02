import { Component, OnInit, ViewChild } from '@angular/core';

import {
	trigger,
	state,
	style,
	animate,
	transition
} from '@angular/animations';


import { PathfindingGridComponent } from './components/pathfinding-grid/pathfinding-grid.component';
import { PathfindingService } from './services/pathfinding.service';
import { AvailableAlgorithm, AvailableAlgorithmType, availableAlgorithms } from './models/algorithm';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	animations: [

		trigger('openClose', [

			state('open', style({
				transform: 'translateX(-52%)'
			})),
	
			state('close', style({
				transform: 'translateX(0)'
			})),
	
			transition('open => close', [
				animate('600ms')
			]),
			transition('close => open', [
				animate('600ms')
			])

		]),

		trigger('openCloseConfiguration', [

			state('open', style({
				transform: 'translateX(0)'
			})),
	
			state('close', style({
				transform: 'translateX(110%)'
			})),
	
			transition('open => close', [
				animate('600ms')
			]),
			transition('close => open', [
				animate('600ms')
			])

		])


	]
})
export class AppComponent implements OnInit {

	@ViewChild(PathfindingGridComponent, {static: true}) pathfindingGridComponent: PathfindingGridComponent;
	
	isOpen = false;
	cellSize = 20;
	safetyPadding = 50;

	width = 0;
	height = 0;
	cells: string[] = [];
	availableAlgorithms: AvailableAlgorithm[] = [];


	constructor(
		private _pathfindingService: PathfindingService
	) {

	}

	ngOnInit() {
		this.availableAlgorithms = availableAlgorithms;

		let mainDivReference = document.getElementById("main-container-block");
		this.width = Math.floor((mainDivReference.getBoundingClientRect().width - this.safetyPadding) / this.cellSize);
		this.height = Math.floor((mainDivReference.getBoundingClientRect().height- this.safetyPadding) / this.cellSize);
	}

	toggle() {
		this.isOpen = !this.isOpen;
	}

	onStart() {
		if (this.pathfindingGridComponent) {
			this.pathfindingGridComponent.startPathfindingAlgorithme();
		}
	}

	onSelect(algorithm: AvailableAlgorithmType) {
		this._pathfindingService.selectedAlgorithm = algorithm;
	}

	test() {
		return this._pathfindingService.selectedAlgorithm;
	}
}
