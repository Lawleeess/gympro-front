import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { LoginGuard } from './login.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'auth', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'home',
    component: MainLayoutComponent,
    children: [
      {
        path: 'main',
        loadChildren: () =>
          import('./layouts/main-layout/main-layout.module').then(
            (m) => m.MainLayoutModule
          ),
        canActivate: [LoginGuard],
      },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./layouts/dashboard-layout/dashboard-layout.module').then(
            (m) => m.DashboardLayoutModule
          ),
        canActivate: [LoginGuard],
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./layouts/auth-layout/auth-layout.module').then(
            (m) => m.AuthLayoutModule
          ),
      },
    ],
  },
  { path: '404', component: PageNotFoundComponent },
  { path: 'privacy', component: PrivacyComponent },

  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [],
})
export class AppRoutingModule {}
