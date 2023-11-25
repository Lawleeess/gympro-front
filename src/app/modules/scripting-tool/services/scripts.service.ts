import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configuration } from 'src/app/app.constants';
import { throwError } from 'rxjs';
import { Account } from 'src/app/models/account';


@Injectable({
  providedIn: 'root'
})
export class ScriptsService {
  private baseUrl: string;

  private _accounts: Account[];
  private _categories: string[];

  get accounts() {
    return this._accounts;
  }

  set accounts(value) {
    this._accounts = value;
  }

  get categories() {
    return this._categories;
  }

  set categories(value) {
    this._categories = value;
  }

  constructor(
    private http: HttpClient,
    private config: Configuration) {

    this.baseUrl = this.config.endpoint
  }

  /**
   * BASIC INFO
   */
  getAccounts() {
    return this.http.get(`${this.baseUrl}/accounts`);
  }

  getCategories() {
    return this.http.get(`${this.baseUrl}/categories`);
  }

  getScripts(category?: string) {
    return this.http.get(`${this.baseUrl}/scripts${category ? `?category=${category}` : ''}`);
  }


  /**
  * HISTORICAL
  */
  getHistory(accountID?: number) {
    return this.http.get(`${this.baseUrl}/historics${accountID ? `?account_id=${accountID}` : ''}`);
  }


  /**
  * EXECUTE SCRIPT
  */
  postExcecuteScript(scriptID: number, script: object) {
    if (!scriptID) {
      throwError('[script.service]: not provided scriptID')
    }

    return this.http.post(`${this.baseUrl}/scripts/${scriptID}/run`, script)
  }


  /**
   * ACCOUNT SCRIPS (SCHEDULER)
   */
  getAccountScripts(accountID: number) {
    if (!accountID) {
      throwError('[scripts.service]: not accountID provided');
    }

    return this.http.get(`${this.baseUrl}/accounts/${accountID}/scripts`);
  }

  postAccountScript(accountID: number, script) {
    if (!accountID) {
      throwError('[scripts.service]: not accountID provided');
    }
    if (!script) {
      throwError('[scripts.service]: not script provided');
    }

    return this.http.post(`${this.baseUrl}/accounts/${accountID}/scripts`, script);
  }

  deleteAccountScript(accountID: number, scriptID: number) {
    if (!accountID) {
      throwError('[scripts.service]: not accountID provided');
    }
    if (!scriptID) {
      throwError('[scripts.service]: not scriptID provided');
    }

    return this.http.delete(`${this.baseUrl}/accounts/${accountID}/scripts/${scriptID}`);
  }
}
