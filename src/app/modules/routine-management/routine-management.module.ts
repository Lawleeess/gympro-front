import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutineManagementComponent } from './routine-management.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { RoutineManagementRoutes } from './routine-management.routing';
import { UsersComponent } from './pages/users/users.component';
import { RoutineEditorComponent } from './pages/routine-editor/routine-editor.component';
import { RoutineListComponent } from './components/routine-list/routine-list.component';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';



@NgModule({
  declarations: [
    RoutineManagementComponent,
    UsersListComponent,
    UsersComponent,
    RoutineEditorComponent,
    RoutineListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(RoutineManagementRoutes),
    DragDropModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
  ]
})
export class RoutineManagementModule { }
