import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersOverviewComponent } from './filters-overview.component';

describe('FiltersOverviewComponent', () => {
  let component: FiltersOverviewComponent;
  let fixture: ComponentFixture<FiltersOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltersOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
