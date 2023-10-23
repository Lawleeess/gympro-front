import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from 'src/app/app.constants';
import { Module } from 'src/app/models/user';
import { isEmpty } from 'lodash-es';
import { Customers } from '../../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UsersManagementService {
  private baseUrl: string;

  constructor(private config: Configuration, private http: HttpClient) {
    this.baseUrl = `${this.config.endpoint}/user-management/users`;
  }

  getUsers(
    offset: number = 0,
    limit: number = 50,
    roles?: string,
    filter?: string
  ): Observable<Object> {
    let queryParams = `offset=${offset}&limit=${limit}`;

    if (!!roles) {
      queryParams = `${queryParams}&user_role=${encodeURIComponent(
        roles
      )}`;
    }

    if (!!filter) {
      queryParams = `${queryParams}&filter=${encodeURIComponent(filter)}`;
    }
    console.log(this.http.get(`${this.baseUrl}?${queryParams}`));
    return this.http.get(`${this.baseUrl}?${queryParams}`);
  }

  getUser(userID: string): Observable<Object> {
    if (!userID) {
      throw new Error('[users-management.service]: not userID provided');
    }
    return this.http.get(`${this.baseUrl}/${userID}`);
  }

  deleteUser(userID: string): Observable<Object> {
    if (!userID) {
      throw new Error('[users-management.service]: not userID provided');
    }
    return this.http.delete(`${this.baseUrl}/${userID}`);
  }

  updateUserModules(userID: string, modules: Module[]): Observable<Object> {
    if (!userID) {
      throw new Error('[users-management.service]: not userID provided');
    }
    if (isEmpty(modules)) {
      throw new Error('[users-management.service]: not modules provided');
    }
    return this.http.put(`${this.baseUrl}/${userID}/permissions`, modules);
  }

  updateClientWithPermissions(userID: string, customers: Customers) {
    if (!userID) {
      throw new Error('[users-management.service]: not userID provided');
    }
    if (isEmpty(customers)) {
      throw new Error('[users-management.service]: not clients provided');
    }
    return this.http.put(
      `${this.baseUrl}/${userID}/clients-permissions`,
      customers
    );
  }

  async getAllUsers(): Promise<any[]> {
    let increment: number = 250;
    let offset: number = 0;
    let limit: number = increment;
    let allUsers = [];
    let users: any = [];

    while (
      users !== null &&
      (users.length === increment || allUsers.length === 0)
    ) {
      const promise = this.getUsers(offset, limit).toPromise();

      try {
        users = await promise;

        offset = limit;
        limit += increment;

        if (!!users) {
          allUsers = [...allUsers, ...users.items];
        }
      } catch (error) {
        throw error;
      }
    }
    return allUsers;
  }
}
