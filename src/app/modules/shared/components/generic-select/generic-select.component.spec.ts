import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericSelectComponent } from './generic-select.component';

describe('GenericSelectComponent', () => {
  let component: GenericSelectComponent;
  let fixture: ComponentFixture<GenericSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
