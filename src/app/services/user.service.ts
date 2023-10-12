import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { Configuration } from 'src/app/app.constants';
import { Preference, PreferenceDetails, User } from 'src/app/models/user';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MODULES, PAGES } from '../constants/modules';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string;

  private _user: User = new User();
  private userSource = new Subject<User>();
  user$ = this.userSource.asObservable();

  private _loggedIn = false;

  get user(): User {
    return this._user;
  }

  set user(user: User) {
    if (!user) {
      return;
    }
    this._user = user;
    this.userSource.next(this._user);
  }

  get loggedIn(): boolean {
    return !!JSON.parse(window.localStorage.getItem('auth_token'));
  }

  constructor(
    private config: Configuration,
    private http: HttpClient,
    private router: Router
  ) {
    this._loggedIn = !!JSON.parse(window.localStorage.getItem('auth_token'));

    this.user.id = !!window.localStorage.getItem('user_id')
      ? JSON.parse(window.localStorage.getItem('user_id'))
      : null;

    this.user.email = !!window.localStorage.getItem('user_email')
      ? JSON.parse(window.localStorage.getItem('user_email'))
      : null;

    this.user.name = !!window.localStorage.getItem('user_name')
      ? JSON.parse(window.localStorage.getItem('user_name'))
      : null;

    this.user.lastname = !!window.localStorage.getItem('user_lastname')
      ? JSON.parse(window.localStorage.getItem('user_lastname'))
      : null;

    if (window.localStorage.getItem('modules')) {
      this.user.modulesWithPermission = !!window.localStorage.getItem('modules')
      ? JSON.parse(window.localStorage.getItem('modules'))
      : null;
    }

    this.baseUrl = this.config.endpoint;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  login(email: string, psw: string): Observable<object> {
    if (!email) {
      return throwError('[user.service]: not email provided');
    }
    if (!psw) {
      return throwError('[user.service]: not psw provided');
    }

    // Delete last session info if token expired and user doesn't logout.
    if (JSON.parse(window.localStorage.getItem('user_email')) !== email) {
      window.localStorage.clear();
    }

    // const password = this.hashPsw(psw);
    const password = psw;
    return this.http
      .post(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        tap((auth: any) => {
          if (auth.user && auth.token) {
            this.user = auth.user;

            window.localStorage.setItem(
              'user_id',
              JSON.stringify(this.user.id)
            );
            window.localStorage.setItem(
              'user_email',
              JSON.stringify(this.user.email)
            );
            window.localStorage.setItem(
              'user_name',
              JSON.stringify(this.user.name)
            );
            window.localStorage.setItem(
              'user_lastname',
              JSON.stringify(this.user.lastname)
            );
            window.localStorage.setItem(
              'modules',
              JSON.stringify(this.user.modulesWithPermission)
            );
            window.localStorage.setItem(
              'auth_token',
              JSON.stringify(auth.token)
            );
            window.localStorage.setItem(
              'refresh_token',
              JSON.stringify(auth.refreshToken)
            );
            window.localStorage.setItem(
              'clientsRole',
              JSON.stringify(this.user.clientsRole)
            );
            window.localStorage.setItem(
              'birthday',
              JSON.stringify(this.user.birthday)
            );
            window.localStorage.setItem(
              'phone_number',
              JSON.stringify(this.user.phone_number)
            );
            window.localStorage.setItem(
              'subscription',
              JSON.stringify(this.user.subscription)
            );
            window.localStorage.setItem(
              'role',
              JSON.stringify(this.user.role)
            );
            this._loggedIn = true;
          }
        })
      );
  }

  signup(signupInfo: SignupInfo): Observable<object> {
    if (!signupInfo) {
      return throwError('[user.service]: not signupInfo provided');
    }
    return this.http.post(`${this.baseUrl}/auth/signup`, signupInfo);
  }

  forgotPassword(recovery: ForgottPasword): Observable<object> {
    if (!recovery.email) {
      return throwError('[user.service]: not email provided');
    }
    return this.http.post(`${this.baseUrl}/auth/recover`, recovery);
  }

  logout(redirectToLogin: boolean = true): void {
    this._loggedIn = false;
    this._user = new User();

    if (redirectToLogin) {
      this.router.navigate(['/login']);
    }
    window.localStorage.clear();
  }

  getUserRole(user: User, moduleName: string): string {
    if (!user) {
      console.error('[user.ts]: not provided user');
      return;
    }

    if (!moduleName) {
      console.error('[user.ts]: not provided moduleName');
      return;
    }

    const userMgmntModule = user.modulesWithPermission.find(
      (i) => i.name === moduleName
    );

    if (!userMgmntModule) {
      console.error(
        `[user-service.ts]: "${userMgmntModule.name}" is an invalid module name. Module not found in valid MODULES const`
      );
      return;
    } else {
      return userMgmntModule.role;
    }
  }

  getClientsWithAccess(): Observable<Object> {
    return this.http.get(`${this.baseUrl}/my-clients`);
  }

  
}

export interface SignupInfo {
  name: string;
  lastname: string;
  phone_number: string;
  birthday: string;
  email: string;
  password: string;
}

export interface ForgottPasword {
  email: string;
  requestType: string;
}