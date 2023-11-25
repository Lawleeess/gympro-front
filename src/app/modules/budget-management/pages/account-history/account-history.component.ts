import { Component, OnDestroy, OnInit } from '@angular/core';
import { REQ_STATUS } from 'src/app/constants/general';
import { Option, Period, Tabs } from 'src/app/models/general';
import { TimeLineChanges } from '../../components/changes-timeline/changes-timeline.component';
import { ChartLineUpsDownsData } from 'src/app/modules/charts/components/chart-line-ups-downs/chart-line-ups-downs.component';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BudgetManagementService } from '../../services/budget-management.service';
import { parseUTCtoTZ } from 'src/app/tools/functions/parse-date';
import * as moment from 'moment';
import 'moment-timezone';

@Component({
  selector: 'app-account-history',
  templateUrl: './account-history.component.html',
  styleUrls: ['./account-history.component.scss'],
})
export class AccountHistoryComponent implements OnInit, OnDestroy {
  budgetAndFeeTabs: Tabs = {
    selectedIndex: 0,
    options: [
      {
        label: 'Presupuesto',
        value: 'budget',
      },
      {
        label: 'Fee',
        value: 'fee',
      },
    ],
  };

  originalChangesList: TimeLineChanges[] = [];
  changesList: TimeLineChanges[] = [];
  changeListReqStatus: number = REQ_STATUS.INITIAL;
  changesChart: ChartLineUpsDownsData[] = [];
  errorMsg: string;
  routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private budgetManagementService: BudgetManagementService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe((params) => {
      if (!!params.clientId && !!params.accountId) {
        this.getChanges(params.clientId, params.accountId);
        this.errorMsg && delete this.errorMsg;
      } else {
        console.error(
          '[account-history.component]: not client id and/or account id provided as query param in the route'
        );

        this.errorMsg =
          'No fue posible encontrar el id del cliente y/o el id de la cuenta.';
        this.changeListReqStatus = REQ_STATUS.ERROR;
      }
    });
  }

  getPeriod(): Period {
    const period: Period = new Period();
    const monthsAgo: number = 6;

    period.startDate = moment()
      .subtract(monthsAgo, 'months')
      .format('YYYY-MM-DD');

    period.endDate = moment().endOf('month').format('YYYY-MM-DD');

    return period;
  }

  getChanges(clientID: string, accountID: string): void {
    this.changeListReqStatus = REQ_STATUS.LOADING;

    const { startDate, endDate } = this.getPeriod();

    this.budgetManagementService
      .getAccountChanges(clientID, accountID, startDate, endDate)
      .subscribe(
        (resp: any[]) => {
          if (!!resp) {
            this.originalChangesList = resp.map((i) => {
              return {
                ...i,
                date: parseUTCtoTZ(i.date),
                previousValue: Number(i.previousValue) || 0,
                newValue: Number(i.newValue) || 0,
              };
            });
          } else {
            this.originalChangesList = [];
          }

          this.changesList = [...this.originalChangesList];

          this.filterChangesByType();
          this.changeListReqStatus = REQ_STATUS.SUCCESS;
        },
        (error) => {
          console.error(error);
          this.changeListReqStatus = REQ_STATUS.ERROR;
        }
      );
  }

  filterChangesByType(): void {
    this.changeListReqStatus = REQ_STATUS.LOADING;
    const selectedTab: Option =
      this.budgetAndFeeTabs.options[this.budgetAndFeeTabs.selectedIndex];

    this.changesList = this.originalChangesList.filter(
      (i) => i.field === selectedTab.value
    );

    this.getChartData();

    // simulating a loader as transition
    setTimeout(() => {
      this.changeListReqStatus = REQ_STATUS.SUCCESS;
    }, 100);
  }

  getChartData(): void {
    this.changesChart = this.changesList.map((i) => {
      return { date: moment(i.date).valueOf(), value: i.newValue };
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
