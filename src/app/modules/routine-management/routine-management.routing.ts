import { Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';
import { RoutineEditorComponent } from './pages/routine-editor/routine-editor.component';

export const RoutineManagementRoutes: Routes = [
  { path: '', component: UsersComponent, pathMatch: 'full' },
  { path: 'edit', component: RoutineEditorComponent },
];
