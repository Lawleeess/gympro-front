import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuditComponent } from './audit.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ClientAccountsComponent } from './pages/client-accounts/client-accounts.component';
import { ClientAuditHistoryComponent } from './pages/client-audit-history/client-audit-history.component';
import { ClientAuditResultComponent } from './pages/client-audit-result/client-audit-result.component';
import { AuditRoutes } from './audit.routing';
import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from '../charts/charts.module';
import { PeriodFilterComponent } from './components/period-filter/period-filter.component';
import { PanelResultComponent } from './components/panel-result/panel-result.component';
import { ChartsMiniModule } from '../charts-mini/charts-mini.module';

@NgModule({
  declarations: [
    AuditComponent,
    ClientsComponent,
    ClientAccountsComponent,
    ClientAuditHistoryComponent,
    ClientAuditResultComponent,
    PeriodFilterComponent,
    PanelResultComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AuditRoutes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ChartsModule,
    ChartsMiniModule,
  ],
})
export class AuditModule {}
