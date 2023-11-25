import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartLineUpsDownsComponent } from './chart-line-ups-downs.component';

describe('ChartLineUpsDownsComponent', () => {
  let component: ChartLineUpsDownsComponent;
  let fixture: ComponentFixture<ChartLineUpsDownsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartLineUpsDownsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartLineUpsDownsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
