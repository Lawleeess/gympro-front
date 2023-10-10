import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTabSelectorComponent } from './main-tab-selector.component';

describe('MainTabSelectorComponent', () => {
  let component: MainTabSelectorComponent;
  let fixture: ComponentFixture<MainTabSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainTabSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTabSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
