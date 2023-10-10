import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Configuration } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private baseUrl: string;

  constructor(private config: Configuration, private http: HttpClient) {
    this.baseUrl = `${this.config.endpoint}/modules/audits`;
  }

  getClients(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
      return throwError('[audit.service]: not valid period provided.');
    }

    const queryParams = `?start_date=${startDate}&end_date=${endDate}`;

    return this.http.get(`${this.baseUrl}/clients/score${queryParams}`);
  }

  getAccounts(
    clientID: string,
    startDate: string,
    endDate: string,
    provider: string
  ) {
    if (!clientID) {
      return throwError('[audit.service]: not clientID provided.');
    }

    if (!startDate || !endDate) {
      return throwError('[audit.service]: not valid period provided.');
    }

    let queryParams = `?start_date=${startDate}&end_date=${endDate}`;

    if (!!provider) {
      queryParams = `${queryParams}&provider=${provider}`;
    }

    return this.http.get(
      `${this.baseUrl}/clients/${clientID}/accounts/score${queryParams}`
    );
  }

  getAudits(
    clientID: string,
    accountID: string,
    startDate: string,
    endDate: string
  ) {
    if (!clientID) {
      return throwError('[audit.service]: not clientID provided.');
    }
    if (!accountID) {
      return throwError('[audit.service]: not accountID provided.');
    }
    if (!startDate || !endDate) {
      return throwError('[audit.service]: not valid period provided.');
    }

    const queryParams = `?start_date=${startDate}&end_date=${endDate}`;

    return this.http.get(
      `${this.baseUrl}/clients/${clientID}/accounts/${accountID}${queryParams}`
    );
  }

  getAudit(clientID: string, accountID: string, auditID: string) {
    if (!clientID) {
      return throwError('[audit.service]: not clientID provided.');
    }
    if (!accountID) {
      return throwError('[audit.service]: not accountID provided.');
    }
    if (!auditID) {
      return throwError('[audit.service]: not auditID provided.');
    }

    return this.http.get(
      `${this.baseUrl}/clients/${clientID}/accounts/${accountID}/${auditID}`
    );
  }

  getAuditDetails(
    clientID: string,
    accountID: string,
    auditID: string,
    evaluationID: number
  ) {
    if (!clientID) {
      return throwError('[audit.service]: not clientID provided.');
    }
    if (!accountID) {
      return throwError('[audit.service]: not accountID provided.');
    }
    if (!auditID) {
      return throwError('[audit.service]: not auditID provided.');
    }
    if (!evaluationID) {
      return throwError('[audit.service]: not evaluationID provided.');
    }

    return this.http.get(
      `${this.baseUrl}/clients/${clientID}/accounts/${accountID}/${auditID}/evaluations/${evaluationID}/details`
    );
  }
}
