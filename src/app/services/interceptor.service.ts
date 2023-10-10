import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SessionInterceptor {
  constructor(
    private userService: UserService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = JSON.parse(localStorage.getItem('auth_token'));
    if (authToken) {
      request = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + authToken)
      });
    }

    return next.handle(request).pipe(
      tap(() => { },
        err => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            this.userService.logout();
          }
        })
    );
  }
}
