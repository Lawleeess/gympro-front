import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthLayoutRoutes } from './auth-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthModule } from 'src/app/modules/auth/auth.module';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    NgbModule,
    AuthModule
  ]
})
export class AuthLayoutModule { }
