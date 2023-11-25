import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSortedBarComponent } from './chart-sorted-bar.component';

describe('ChartSortedBarComponent', () => {
  let component: ChartSortedBarComponent;
  let fixture: ComponentFixture<ChartSortedBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartSortedBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSortedBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
