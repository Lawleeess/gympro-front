import { Routes } from '@angular/router';
import { CustomersComponent } from './pages/customers/customers.component';
import { NewCustomerComponent } from './pages/new-customer/new-customer.component';

export const CustomerManagementRoutes: Routes = [
  { path: '', component: CustomersComponent, pathMatch: 'full' },
  { path: 'new', component: NewCustomerComponent },
  { path: 'edit', component: NewCustomerComponent },
];
