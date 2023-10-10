import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DroptipComponent } from './droptip.component';

describe('DroptipComponent', () => {
  let component: DroptipComponent;
  let fixture: ComponentFixture<DroptipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DroptipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DroptipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
