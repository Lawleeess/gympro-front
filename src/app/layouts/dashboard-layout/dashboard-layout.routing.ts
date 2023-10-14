import { Routes } from '@angular/router';

import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { ScriptingToolComponent } from 'src/app/modules/scripting-tool/scripting-tool.component';
import { UserInfoComponent } from 'src/app/modules/user-info/user-info.component';
import { AuditComponent } from 'src/app/modules/audit/audit.component';
import { UsersManagementComponent } from 'src/app/modules/users-management/users-management.component';
import { BudgetManagementComponent } from 'src/app/modules/budget-management/budget-management.component';

export const DashboardLayoutRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    loadChildren: () =>
      import('src/app/modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'profile',
    component: UserInfoComponent,
    loadChildren: () =>
      import(
        'src/app/modules/user-info/user-info.module'
      ).then((m) => m.UserInfoModule),
  },
  {
    path: 'scripting-tool',
    component: ScriptingToolComponent,
    loadChildren: () =>
      import('src/app/modules/scripting-tool/scripting-tool.module').then(
        (m) => m.ScriptingToolModule
      ),
  },
  {
    path: 'audit',
    component: AuditComponent,
    loadChildren: () =>
      import('src/app/modules/audit/audit.module').then((m) => m.AuditModule),
  },
  {
    path: 'users',
    component: UsersManagementComponent,
    loadChildren: () =>
      import('src/app/modules/users-management/users-management.module').then(
        (m) => m.UsersManagementModule
      ),
  },
  {
    path: 'budgets',
    component: BudgetManagementComponent,
    loadChildren: () =>
      import('src/app/modules/budget-management/budget-management.module').then(
        (m) => m.BudgetManagementModule
      ),
  },
];
