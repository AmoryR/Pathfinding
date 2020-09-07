import { Component, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

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

import { TutorialDialogComponent } from './components/tutorial-dialog/tutorial-dialog.component';

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
	cellSize = 30; // $cell-size
	safetyPadding = 50;

	width = 0;
	height = 0;
	cells: string[] = [];
	availableAlgorithms: AvailableAlgorithm[] = [];


	constructor(
		private _matDialog: MatDialog,
		private _renderer: Renderer2,
		private _pathfindingService: PathfindingService
	) {

	}

	ngOnInit() {

		let userOs = this.getOS();
		if (userOs == 'iOS' || userOs == 'Android') {
			this.osNotSupportedMode();
			return;
		}

		// const dialogRef = this._matDialog.open(TutorialDialogComponent, {
		// 	width: '900px'
		// });

		this.availableAlgorithms = availableAlgorithms;
		this.mainDivReference = document.getElementById("main-container-block");
		this.setGridSize();
	}

	@HostListener('window:resize', ['$event']) onResize(event) {
		console.warn("Window resize");
	}

	getOS() {
		var userAgent = window.navigator.userAgent,
			platform = window.navigator.platform,
			macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
			windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
			iosPlatforms = ['iPhone', 'iPad', 'iPod'],
			os = null;
	  
		if (macosPlatforms.indexOf(platform) !== -1) {
		  os = 'Mac OS';
		} else if (iosPlatforms.indexOf(platform) !== -1) {
		  os = 'iOS';
		} else if (windowsPlatforms.indexOf(platform) !== -1) {
		  os = 'Windows';
		} else if (/Android/.test(userAgent)) {
		  os = 'Android';
		} else if (!os && /Linux/.test(platform)) {
		  os = 'Linux';
		}
	  
		return os;
	}

	osNotSupported = false;
	private osNotSupportedMode() {

		/* HIDE */

		// Information button
		var informationButton = document.getElementById("information-button");
		this._renderer.setStyle(informationButton, "display", "none");

		// Main container
		var mainContainer = document.getElementById("main-container");
		this._renderer.setStyle(mainContainer, "display", "none");

		// Configuration container
		var configurationContainer = document.getElementById("configuration-container");
		this._renderer.setStyle(configurationContainer, "display", "none");

		// Start button
		var startButton = document.getElementById("start-button");
		this._renderer.setStyle(startButton, "display", "none");

		/* SHOW */
		this.osNotSupported = true;

	}

	mainDivReference: HTMLElement;
	private setGridSize() {

		if (this.mainDivReference == undefined || this.mainDivReference == null) {
			this.mainDivReference = document.getElementById("main-container-block");
			setTimeout(() => { this.setGridSize(); }, 200);
			return;
		}

		
		let height = Math.floor((this.mainDivReference.getBoundingClientRect().height - this.safetyPadding) / this.cellSize);

		if (height < 1) {
			setTimeout(() => { this.setGridSize(); }, 200);
		} else {
			this.width = Math.floor((this.mainDivReference.getBoundingClientRect().width - this.safetyPadding) / this.cellSize);
			this.height = height;

			if (this.pathfindingGridComponent) {
				this.pathfindingGridComponent.setUpGrid(this.width, this.height);
			}
		}

	}

	toggle() {
		this.isOpen = !this.isOpen;
	}

	onStart() {
		if (this.pathfindingGridComponent) {
			this.pathfindingGridComponent.startPathfindingAlgorithme();
		}
	}

	onSelectAlgorithm(algorithm: AvailableAlgorithmType) {
		this._pathfindingService.selectedAlgorithm = algorithm;
	}

	getStartButtonTitle() : string {
		switch (this.pathfindingGridComponent.state) {
			case "not-started":
				return "Start";
			case "in-progress":
				return "In progress";
			case "done":
				return "Clear";
			default:
				return "State error";
		}
	}

	getSelectedAlgorithm() : string {
		return this._pathfindingService.selectedAlgorithm;
	}
}
