import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { UsersManagementComponent } from './users-management.component';
import { UsersComponent } from './pages/users/users.component';
import { UsersManagementRoutes } from './users-management.routing';
import { UsersListComponent } from './components/users-list/users-list.component';
import { ModulesListComponent } from './components/modules-list/modules-list.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { ModuleFormComponent } from './components/module-form/module-form.component';
import { ToolsListComponent } from './components/tools-list/tools-list.component';
import { ToolsFormComponent } from './components/tools-form/tools-form.component';
import { CustomersListComponent } from './components/customers-list/customers-list.component';
import { CustomersFormComponent } from './components/customers-form/customers-form.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';

@NgModule({
  declarations: [
    UsersManagementComponent,
    UsersComponent,
    UsersListComponent,
    ModulesListComponent,
    UserDetailsComponent,
    ModuleFormComponent,
    ToolsListComponent,
    ToolsFormComponent,
    CustomersListComponent,
    CustomersFormComponent,
    UserEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(UsersManagementRoutes),
  ],
})
export class UsersManagementModule {}
