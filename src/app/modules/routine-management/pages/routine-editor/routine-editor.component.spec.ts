import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutineEditorComponent } from './routine-editor.component';

describe('RoutineEditorComponent', () => {
  let component: RoutineEditorComponent;
  let fixture: ComponentFixture<RoutineEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutineEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutineEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
