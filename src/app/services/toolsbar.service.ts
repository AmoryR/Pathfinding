import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ToolsbarService {

    selectTemplateSubject = new Subject();

    constructor() { }

    emitSelectTemplateSubject() {
        this.selectTemplateSubject.next();
    }

}