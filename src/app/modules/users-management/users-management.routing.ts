import { Routes } from '@angular/router';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { UsersComponent } from './pages/users/users.component';

export const UsersManagementRoutes: Routes = [
  { path: '', component: UsersComponent, pathMatch: 'full' },
  { path: 'details', component: UserDetailsComponent },
];
