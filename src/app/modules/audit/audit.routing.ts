import { Routes } from '@angular/router';
import { ClientsComponent } from './pages/clients/clients.component';
import { ClientAccountsComponent } from './pages/client-accounts/client-accounts.component';
import { ClientAuditHistoryComponent } from './pages/client-audit-history/client-audit-history.component';
import { ClientAuditResultComponent } from './pages/client-audit-result/client-audit-result.component';

export const AuditRoutes: Routes = [
  { path: '', component: ClientsComponent, pathMatch: 'full' },
  { path: 'accounts', component: ClientAccountsComponent },
  { path: 'history', component: ClientAuditHistoryComponent },
  { path: 'results', component: ClientAuditResultComponent },
];
