import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { UserInfoComponent } from './user-info.component';

import {MatProgressBarModule} from '@angular/material/progress-bar';


import { CustomersComponent } from './pages/customers/customers.component';

@NgModule({
  declarations: [
    UserInfoComponent,
    CustomersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatProgressBarModule,
  ],
})
export class UserInfoModule {}
