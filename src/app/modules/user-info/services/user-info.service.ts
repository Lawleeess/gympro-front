import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  private baseUrl: string;

  constructor(private config: Configuration, private http: HttpClient) {
    this.baseUrl = `${this.config.endpoint}/user-management/users`;
  }

  getCustomers() {
    return this.http.get(`${this.baseUrl}/modules/client-management/clients`);
  }

  getCustomer(customerID) {
    if (!customerID) {
      throw new Error('[user-info.service]: not customerID provided');
    }
    return this.http.get(
      `${this.baseUrl}/modules/client-management/clients/${customerID}`
    );
  }

  createCustomer(customer) {
    if (!customer) {
      throw new Error('[user-info.service]: not customer provided');
    }
    return this.http.post(
      `${this.baseUrl}/modules/client-management/clients`,
      customer
    );
  }

  updateCustomer(customer) {
    if (!customer) {
      throw new Error('[user-info.service]: not customer provided');
    }
    return this.http.put(
      `${this.baseUrl}/modules/client-management/clients/${customer.id}`,
      customer
    );
  }

  getUser(userID: string): Observable<Object> {
    if (!userID) {
      throw new Error('[users-management.service]: not userID provided');
    }
    return this.http.get(`${this.baseUrl}/${userID}`);
  }
}
