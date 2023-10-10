import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from '../charts/charts.module';
import { RouterModule } from '@angular/router';
import { BudgetManagementRoutes } from './budget-management.routing';

import { BudgetManagementComponent } from './budget-management.component';
import { BudgetOverviewComponent } from './pages/budget-overview/budget-overview.component';
import { AccountHistoryComponent } from './pages/account-history/account-history.component';
import { FiltersOverviewComponent } from './components/filters-overview/filters-overview.component';
import { ScoreCardComponent } from './components/score-card/score-card.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { ChangesTimelineComponent } from './components/changes-timeline/changes-timeline.component';
import { AddBudgetModalComponent } from './components/add-budget-modal/add-budget-modal.component';

@NgModule({
  declarations: [
    BudgetManagementComponent,
    BudgetOverviewComponent,
    AccountHistoryComponent,
    FiltersOverviewComponent,
    ScoreCardComponent,
    ConfirmationModalComponent,
    ChangesTimelineComponent,
    AddBudgetModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(BudgetManagementRoutes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ChartsModule,
  ],
})
export class BudgetManagementModule {}
