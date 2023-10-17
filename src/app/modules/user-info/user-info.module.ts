import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { UserInfoComponent } from './user-info.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { NewCustomerComponent } from './pages/new-customer/new-customer.component';
import { CustomerManagementRoutes } from './user-info.routing';
import { FormNewCustomerDataComponent } from './components/form-new-client-data/form-new-customer-data.component';
import { FormNewCustomerAccountsComponent } from './components/form-new-customer-accounts/form-new-customer-accounts.component';
import { CustomerReviewComponent } from './components/customer-review/customer-review.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    UserInfoComponent,
    CustomersComponent,
    NewCustomerComponent,
    FormNewCustomerDataComponent,
    FormNewCustomerAccountsComponent,
    CustomerReviewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatProgressBarModule,
    RouterModule.forChild(CustomerManagementRoutes),
  ],
})
export class UserInfoModule {}
