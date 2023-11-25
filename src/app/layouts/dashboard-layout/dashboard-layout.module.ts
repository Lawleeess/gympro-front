import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardLayoutRoutes } from './dashboard-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ScriptingToolModule } from 'src/app/modules/scripting-tool/scripting-tool.module';
import { DashboardModule } from 'src/app/modules/dashboard/dashboard.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardLayoutRoutes),
    NgbModule,
    DashboardModule,
    ScriptingToolModule,
  ],
})
export class DashboardLayoutModule {}
