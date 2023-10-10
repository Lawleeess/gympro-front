import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Configuration } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string;

  private _loggedIn = false;

  private _user: User = new User();
  private userSource = new Subject<User>();
  user$ = this.userSource.asObservable();

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
    return !!JSON.parse(window.localStorage.getItem('auth_token') || '{}');
  }

  constructor(
    private config: Configuration,
    private http: HttpClient,
    private router: Router
  ) {
    this._loggedIn = !!JSON.parse(window.localStorage.getItem('auth_token')!);

    this.baseUrl = this.config.endpoint;
  }

  logout(redirectToLogin: boolean = true): void {
    this._loggedIn = false;
    this._user = new User();

    if (redirectToLogin) {
      this.router.navigate(['/login']);
    }
    window.localStorage.clear();
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  signup(signupInfo: SignupInfo): Observable<object> {
    if (!signupInfo) {
      return throwError('[user.service]: not signupInfo provided');
    }
    return this.http.post(`${this.baseUrl}/auth/signup`, signupInfo);
  }


  login(email: string, psw: string): Observable<object> {
    if (!email) {
      return throwError('[user.service]: not email provided');
    }
    if (!psw) {
      return throwError('[user.service]: not psw provided');
    }

    // Delete last session info if token expired and user doesn't logout.
    if (JSON.parse(window.localStorage.getItem('user_email') || '{}') !== email) {
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
              'user_department',
              JSON.stringify(this.user.department)
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
            this._loggedIn = true;
          }
        })
      );
  }


}

export interface SignupInfo {
  name: string;
  lastname: string;
  department: string;
  email: string;
  password: string;
}