import { Routes } from '@angular/router';
import { AccountHistoryComponent } from './pages/account-history/account-history.component';
import { BudgetOverviewComponent } from './pages/budget-overview/budget-overview.component';

export const BudgetManagementRoutes: Routes = [
  { path: '', component: BudgetOverviewComponent, pathMatch: 'full' },
  { path: 'history', component: AccountHistoryComponent },
];
