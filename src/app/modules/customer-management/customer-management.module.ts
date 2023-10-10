import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import { CustomerManagementComponent } from './customer-management.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { NewCustomerComponent } from './pages/new-customer/new-customer.component';
import { CustomerManagementRoutes } from './customer-management.routing';
import { FormNewCustomerDataComponent } from './components/form-new-client-data/form-new-customer-data.component';
import { FormNewCustomerAccountsComponent } from './components/form-new-customer-accounts/form-new-customer-accounts.component';
import { CustomerReviewComponent } from './components/customer-review/customer-review.component';

@NgModule({
  declarations: [
    CustomerManagementComponent,
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
    RouterModule.forChild(CustomerManagementRoutes),
  ],
})
export class CustomerManagementModule {}
