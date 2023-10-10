import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAuditHistoryComponent } from './client-audit-history.component';

describe('ClientAuditHistoryComponent', () => {
  let component: ClientAuditHistoryComponent;
  let fixture: ComponentFixture<ClientAuditHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientAuditHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAuditHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
