import { Component, OnInit } from '@angular/core';
import { ToolsbarService } from 'src/app/services/toolsbar.service';

@Component({
	selector: 'toolsbar',
	templateUrl: './toolsbar.component.html',
	styleUrls: ['./toolsbar.component.scss']
})
export class ToolsbarComponent implements OnInit {

	

	constructor(
		private _toolsbarService: ToolsbarService
	) { }

	ngOnInit() {
	}

	onSelectTemplate() {
		this._toolsbarService.emitSelectTemplateSubject();
	}

}
