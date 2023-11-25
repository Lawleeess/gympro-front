import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandbyAccessModulesComponent } from './standby-access-modules.component';

describe('StandbyAccessModulesComponent', () => {
  let component: StandbyAccessModulesComponent;
  let fixture: ComponentFixture<StandbyAccessModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandbyAccessModulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandbyAccessModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
