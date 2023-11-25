import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewModeSelectorComponent } from './view-mode-selector.component';

describe('ViewModeSelectorComponent', () => {
  let component: ViewModeSelectorComponent;
  let fixture: ComponentFixture<ViewModeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewModeSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewModeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
