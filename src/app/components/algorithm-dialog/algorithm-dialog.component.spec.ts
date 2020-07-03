import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmDialogComponent } from './algorithm-dialog.component';

describe('AlgorithmDialogComponent', () => {
  let component: AlgorithmDialogComponent;
  let fixture: ComponentFixture<AlgorithmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlgorithmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
