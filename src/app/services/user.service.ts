import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { Configuration } from 'src/app/app.constants';
import { Preference, PreferenceDetails, User, UserGoals, UserRoutine } from 'src/app/models/user';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MODULES, PAGES } from '../constants/modules';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string;

  private _user: User = new User();
  // private _userGoal: UserGoals = new UserGoals();

  private userSource = new Subject<User>();
  // private userGoalSource = new Subject<UserGoals>();
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

  // get userGoal(): UserGoals {
  //   return this._userGoal;
  // }

  // set userGoal(userGoal: UserGoals) {
  //   if (!userGoal) {
  //     return;
  //   }
  //   this._userGoal = userGoal;
  //   this.userGoalSource.next(this._userGoal);
  // }

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
    this.user.url_image = !!window.localStorage.getItem('url_image')
    ? JSON.parse(window.localStorage.getItem('url_image'))
    : null;
    this.user.name = !!window.localStorage.getItem('user_name')
    ? JSON.parse(window.localStorage.getItem('user_name'))
    : null;
    this.user.lastname = !!window.localStorage.getItem('user_lastname')
    ? JSON.parse(window.localStorage.getItem('user_lastname'))
    : null;
    this.user.email = !!window.localStorage.getItem('user_email')
    ? JSON.parse(window.localStorage.getItem('user_email'))
    : null;
    this.user.birthday = !!window.localStorage.getItem('birthday')
    ? JSON.parse(window.localStorage.getItem('birthday'))
    : null;
    this.user.phone_number = !!window.localStorage.getItem('phone_number')
    ? JSON.parse(window.localStorage.getItem('phone_number'))
    : null;
    this.user.subscription = !!window.localStorage.getItem('subscription')
    ? JSON.parse(window.localStorage.getItem('subscription'))
    : null;
    this.user.userRoutine = !!window.localStorage.getItem('userRoutine')
    ? JSON.parse(window.localStorage.getItem('userRoutine'))
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
              'url_image',
              JSON.stringify(this.user.url_image)
            );
            window.localStorage.setItem(
              'user_role',
              JSON.stringify(this.user.user_role)
            );
            window.localStorage.setItem(
              'userProgress',
              JSON.stringify(this.user.userProgress)
            );
            window.localStorage.setItem(
              'userGoals',
              JSON.stringify(this.user.userGoals)
            );
            this.setUserRoutineNull();
            window.localStorage.setItem(
              'userRoutine',
              JSON.stringify(this.user.userRoutine)
            );
            this._loggedIn = true;
          }
        })
      );
  }

  setUserRoutineNull(): void{
    if (this.user.userRoutine.monday == null){
      this.user.userRoutine.monday = []
    }
    if (this.user.userRoutine.tuesday == null){
      this.user.userRoutine.tuesday = []
    }
    if (this.user.userRoutine.wednesday == null){
      this.user.userRoutine.wednesday = []
    }
    if (this.user.userRoutine.thursday == null){
      this.user.userRoutine.thursday = []
    }
    if (this.user.userRoutine.friday == null){
      this.user.userRoutine.friday = []
    }
    if (this.user.userRoutine.saturday == null){
      this.user.userRoutine.saturday = []
    }
  }

  signup(signupInfo: SignupInfo): Observable<object> {
    if (!signupInfo) {
      return throwError('[user.service]: not signupInfo provided');
    }
    return this.http.post(`${this.baseUrl}/auth/signup`, signupInfo);
  }

  getRoutines(muscleGroup: string): Observable<object> {
    if (!muscleGroup) {
      return throwError('[user.service]: not muscleGroup provided');
    }
    return this.http.get(`${this.baseUrl}/routines?muscle_group=${muscleGroup}`);
  }

  saveRoutinesUser(userID: string, routine: UserRoutine): Observable<object> {
    if (!routine) {
      return throwError('[user.service]: not routine provided');
    }    
    return this.http
      .post(`${this.baseUrl}/users/routines/${userID}`, routine)
      .pipe(
        tap((userGoal: UserGoals) => {
          if (userGoal) {
            window.localStorage.setItem(
              'userGoals',
              JSON.stringify(userGoal)
            );
          }
        })
      );
  }

  registerGoals(goalsInfo: GoalsInfo, userID: string): Observable<object> {
    if (!goalsInfo) {
      return throwError('[user.service]: not goalsInfo provided');
    }    
    return this.http
      .post(`${this.baseUrl}/users/goals/${userID}`, goalsInfo)
      .pipe(
        tap((userGoal: UserGoals) => {
          if (userGoal) {
            window.localStorage.setItem(
              'userGoals',
              JSON.stringify(userGoal)
            );
          }
        })
      );
  }

  uploadUserImage(uploadData: FormData, userID: string): Observable<object> {
    if (!uploadData) {
      return throwError('[user.service]: not uploadData provided');
    }
    return this.http.put(`${this.baseUrl}/users/image/${userID}`, uploadData);
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
      this.router.navigate(['/auth/login']);
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
  user_role?: string;
}

export interface GoalsInfo {
  age: string;
  gender: string;
  height: string;
  weight: string;
  activity: string;
  goal: string;
}

export interface ForgottPasword {
  email: string;
  requestType: string;
}