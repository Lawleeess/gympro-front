
import { Routes } from '@angular/router';
import { ExecuteComponent } from './pages/execute/execute.component';
import { RepositoryComponent } from './pages/repository/repository.component';
import { SchedulerComponent } from './pages/scheduler/scheduler.component';
import { HistoricalComponent } from './pages/historical/historical.component';

export const ScriptingToolRoutes: Routes = [
    { path: 'scripting-tool', redirectTo: 'scripting-tool/historical', pathMatch: 'full' },
    { path: 'historical', component: HistoricalComponent },
    { path: 'execute', component: ExecuteComponent },
    { path: 'repository', component: RepositoryComponent },
    { path: 'scheduler', component: SchedulerComponent },
];
