import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ToolsbarService {

    selectAlgorithmSubject = new Subject();
    selectTemplateSubject = new Subject();
    showInfoSubject = new Subject();

    constructor() { }

    /**
     * Emit select algorithm subject
     */
    emitSelectAlgorithmSubject() {
        this.selectAlgorithmSubject.next();
    }

    /**
     * Emit select template subject
     */
    emitSelectTemplateSubject() {
        this.selectTemplateSubject.next();
    }

    /**
     * Emit show info subject
     */
    emitShowInfoSubject() {
        this.showInfoSubject.next();
    }

}