import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptingToolComponent } from './scripting-tool.component';

describe('ScriptingToolComponent', () => {
  let component: ScriptingToolComponent;
  let fixture: ComponentFixture<ScriptingToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScriptingToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptingToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
