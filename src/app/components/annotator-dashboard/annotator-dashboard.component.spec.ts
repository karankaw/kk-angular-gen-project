import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotatorDashboardComponent } from './annotator-dashboard.component';

describe('AnnotatorDashboardComponent', () => {
  let component: AnnotatorDashboardComponent;
  let fixture: ComponentFixture<AnnotatorDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotatorDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotatorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
