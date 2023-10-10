import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAuditResultComponent } from './client-audit-result.component';

describe('ClientAuditResultComponent', () => {
  let component: ClientAuditResultComponent;
  let fixture: ComponentFixture<ClientAuditResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientAuditResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAuditResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
