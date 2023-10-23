import { Routes } from '@angular/router';

import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { UserInfoComponent } from 'src/app/modules/user-info/user-info.component';
import { UsersManagementComponent } from 'src/app/modules/users-management/users-management.component';
import { GoalsComponent } from 'src/app/modules/goals/goals.component';

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
    path: 'users',
    component: UsersManagementComponent,
    loadChildren: () =>
      import('src/app/modules/users-management/users-management.module').then(
        (m) => m.UsersManagementModule
      ),
  },
  {
    path: 'goals',
    component: GoalsComponent,
    loadChildren: () =>
      import('src/app/modules/goals/goals.module').then((m) => m.GoalsModule),
  },
];
