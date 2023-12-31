import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Configuration } from 'src/app/app.constants';
import { Module, User } from 'src/app/models/user';
import { isEmpty } from 'lodash-es';
import { Customers } from '../../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UsersManagementService {
  private baseUrl: string;
  private baseUrlUsers: string;

  constructor(private config: Configuration, private http: HttpClient) {
    this.baseUrl = `${this.config.endpoint}/user-management/users`;
    this.baseUrlUsers = `${this.config.endpoint}/users`;
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
    return this.http.get(`${this.baseUrl}?${queryParams}`);
  }

  getUsersActive(
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
    return this.http.get(`${this.baseUrl}/active?${queryParams}`);
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

  updateUserData(user: User, userID: string): Observable<object> {
    if (!user) {
      return throwError('[user.service]: not user data provided');
    }
    return this.http.put(`${this.baseUrlUsers}/${userID}`, user);
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
