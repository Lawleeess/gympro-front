import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from 'src/app/app.constants';
import { AccountBudget } from '../components/add-budget-modal/add-budget-modal.component';

@Injectable({
  providedIn: 'root',
})
export class BudgetManagementService {
  private baseUrl: string;

  constructor(private config: Configuration, private http: HttpClient) {
    this.baseUrl = `${this.config.endpoint}/modules/budget-management/clients`;
  }

  getAccounts(
    year: number,
    month: number,
    clientID?: string
  ): Observable<Object> {
    if (!year) {
      throw new Error('[budget-management.service]: not year provided');
    }
    if (!month) {
      throw new Error('[budget-management.service]: not month provided');
    }

    let queryParams = `year=${year}&month=${month}`;
    if (clientID) {
      queryParams = `${queryParams}&client_id=${clientID}`;
    }

    return this.http.get(`${this.baseUrl}/accounts?${queryParams}`);
  }

  updateAccount(
    clientID: string,
    accountID: string,
    property: 'budget' | 'fee',
    value: number = 0,
    budgetName?: string
  ): Observable<Object> {
    if (!clientID) {
      throw new Error('[budget-management.service]: not clientID provided');
    }
    if (!accountID) {
      throw new Error('[budget-management.service]: not accountID provided');
    }
    if (!property) {
      throw new Error('[budget-management.service]: not property provided');
    }

    let endpoint: string = `${this.baseUrl}/${clientID}/accounts/${accountID}/${property}`;
    let payload;

    if (property === 'budget') {
      payload = {
        [property]: value,
        budgetName: !!budgetName ? budgetName : '',
      };
    } else {
      payload = { [property]: value };
    }

    return this.http.put(endpoint, payload);
  }

  getAccountChanges(
    clientID: string,
    accountID: string,
    startDate: string,
    endDate: string
  ): Observable<Object> {
    if (!clientID) {
      throw new Error('[budget-management.service]: not clientID provided');
    }
    if (!accountID) {
      throw new Error('[budget-management.service]: not accountID provided');
    }
    if (!startDate) {
      throw new Error('[budget-management.service]: not startDate provided');
    }
    if (!endDate) {
      throw new Error('[budget-management.service]: not endDate provided');
    }

    const queryParams = `start_date=${startDate}&end_date=${endDate}`;
    return this.http.get(
      `${this.baseUrl}/${clientID}/accounts/${accountID}/changelog?${queryParams}`
    );
  }

  addNewBudgetForAccount(
    clientID: string,
    accountID: string,
    accountName: string,
    budgetInfo: AccountBudget
  ): Observable<Object> {
    if (!clientID) {
      throw new Error('[budget-management.service]: not clientID provided');
    }
    if (!accountID) {
      throw new Error('[budget-management.service]: not accountID provided');
    }
    if (!accountName) {
      throw new Error('[budget-management.service]: not accountName provided');
    }
    if (!budgetInfo) {
      throw new Error('[budget-management.service]: not budgetInfo provided');
    }

    return this.http.post(
      `${this.baseUrl}/${clientID}/accounts/${accountID}/budget/create`,
      { ...budgetInfo, accountName }
    );
  }
}
