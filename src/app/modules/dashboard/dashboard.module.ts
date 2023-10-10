import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutes } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { StandbyAccessModulesComponent } from './components/standby-access-modules/standby-access-modules.component';



@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    StandbyAccessModulesComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule.forChild(DashboardRoutes),
    SharedModule,
  ]
})
export class DashboardModule { }
