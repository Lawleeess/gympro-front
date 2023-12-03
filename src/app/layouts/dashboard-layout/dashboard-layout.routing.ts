import { Routes } from '@angular/router';

import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { UserInfoComponent } from 'src/app/modules/user-info/user-info.component';
import { UsersManagementComponent } from 'src/app/modules/users-management/users-management.component';
import { GoalsComponent } from 'src/app/modules/goals/goals.component';
import { RoutinesComponent } from 'src/app/modules/routines/routines.component';
import { AddAdminComponent } from 'src/app/modules/add-admin/add-admin.component';
import { AddAdminModule } from '../../modules/add-admin/add-admin.module';
import { ExercisesComponent } from 'src/app/modules/exercises/exercises.component';
import { RoutineManagementComponent } from 'src/app/modules/routine-management/routine-management.component';
import { RoutineManagementModule } from '../../modules/routine-management/routine-management.module';

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
  {
    path: 'routine',
    component: RoutinesComponent,
    loadChildren: () =>
      import('src/app/modules/routines/routines.module').then((m) => m.RoutinesModule),
  },
  {
    path: 'routine-management',
    component: RoutineManagementComponent,
    loadChildren: () =>
      import('src/app/modules/routine-management/routine-management.module').then((m) => m.RoutineManagementModule),
  },
  {
    path: 'register',
    component: AddAdminComponent,
    loadChildren: () =>
      import('src/app/modules/add-admin/add-admin.module').then((m) => m.AddAdminModule),
  },
  {
    path: 'exercises',
    component: ExercisesComponent,
    loadChildren: () =>
      import('src/app/modules/exercises/exercises.module').then((m) => m.ExercisesModule),
  },
];
