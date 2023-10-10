import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root',
})
export class CustomerManagementService {
  private baseUrl: string;

  constructor(private config: Configuration, private http: HttpClient) {
    this.baseUrl = this.config.endpoint;
  }

  getCustomers() {
    return this.http.get(`${this.baseUrl}/modules/client-management/clients`);
  }

  getCustomer(customerID) {
    if (!customerID) {
      throw new Error('[customer-management.service]: not customerID provided');
    }
    return this.http.get(
      `${this.baseUrl}/modules/client-management/clients/${customerID}`
    );
  }

  createCustomer(customer) {
    if (!customer) {
      throw new Error('[customer-management.service]: not customer provided');
    }
    return this.http.post(
      `${this.baseUrl}/modules/client-management/clients`,
      customer
    );
  }

  updateCustomer(customer) {
    if (!customer) {
      throw new Error('[customer-management.service]: not customer provided');
    }
    return this.http.put(
      `${this.baseUrl}/modules/client-management/clients/${customer.id}`,
      customer
    );
  }
}
