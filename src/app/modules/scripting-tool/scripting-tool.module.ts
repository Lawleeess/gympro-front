import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ScriptingToolRoutes } from './scripting-tool.routing';
import { SharedModule } from '../shared/shared.module';

// components
import { HistoricalComponent } from './pages/historical/historical.component';
import { ExecuteComponent } from './pages/execute/execute.component';
import { RepositoryComponent } from './pages/repository/repository.component';
import { SchedulerComponent } from './pages/scheduler/scheduler.component';

// angular material
import { MatButtonModule } from '@angular/material/button';
import { ScriptingToolComponent } from './scripting-tool.component';


@NgModule({
  declarations: [
    ScriptingToolComponent,
    HistoricalComponent,
    ExecuteComponent,
    RepositoryComponent,
    SchedulerComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule.forChild(ScriptingToolRoutes),
    SharedModule,
    MatButtonModule,
  ],
  providers: [],
  exports: []
})
export class ScriptingToolModule { }
