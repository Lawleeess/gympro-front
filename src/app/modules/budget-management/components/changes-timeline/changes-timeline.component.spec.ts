import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangesTimelineComponent } from './changes-timeline.component';

describe('ChangesTimelineComponent', () => {
  let component: ChangesTimelineComponent;
  let fixture: ComponentFixture<ChangesTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangesTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangesTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
