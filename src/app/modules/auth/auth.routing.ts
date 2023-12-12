import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { VerifyComponent } from './pages/verify/verify.component';

export const AuthRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent,},
  { path: 'verify', component: VerifyComponent,},
  { path: 'forgot-password', component: ForgotPasswordComponent}
];
