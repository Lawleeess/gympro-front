import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleUnderConstructionComponent } from './module-under-construction.component';

describe('ModuleUnderConstructionComponent', () => {
  let component: ModuleUnderConstructionComponent;
  let fixture: ComponentFixture<ModuleUnderConstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleUnderConstructionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleUnderConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
