import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigurationProvider } from './app.constants';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AppRoutingModule } from './app.routing';
import { LoginGuard } from './login.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { SessionInterceptor } from './services/interceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    PageNotFoundComponent
  ],
  imports: [
    NgbModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [
    LoginGuard,
    HttpClient,
    ConfigurationProvider,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SessionInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
