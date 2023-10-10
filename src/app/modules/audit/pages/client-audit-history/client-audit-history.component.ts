import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { REQ_STATUS } from 'src/app/constants/general';
import { TableColumn } from 'src/app/modules/shared/components/generic-table/generic-table.component';
import { Period } from '../../components/period-filter/period-filter.component';
import { AuditService } from '../../services/audit.service';
import { ChartLineData } from 'src/app/modules/charts/components/chart-line/chart-line.component';
import { isEmpty } from 'lodash-es';
import 'moment-timezone';
import * as moment from 'moment';

@Component({
  selector: 'app-client-audit-history',
  templateUrl: './client-audit-history.component.html',
  styleUrls: ['./client-audit-history.component.scss'],
})
export class ClientAuditHistoryComponent implements OnInit {
  clientID: string;
  account: Account = new Account();
  auditsTableColumns: TableColumn[] = [
    {
      name: 'date',
      title: 'Fecha de ejecución',
    },
    {
      name: 'hour',
      title: 'Hora de ejecución (Hora CDMX)',
    },
    {
      name: 'globalScore',
      title: 'Calificación',
      formatValue: 'percentage',
      decimalInValues: 0,
      textAlign: 'center',
    },
    {
      name: 'details',
      textAlign: 'center',
      icon: 'fas fa-eye',
    },
  ];

  audits = {
    data: [],
    reqStatus: REQ_STATUS.INITIAL,
  };

  scores: ChartLineData[] = [];
  scoresReqStatus: number = REQ_STATUS.INITIAL;
  insufficientScores: boolean;

  errorMsg: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auditService: AuditService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (!!params.clientId && !!params.accountId) {
        this.clientID = params.clientId;
        this.account.id = params.accountId;
        this.errorMsg && delete this.errorMsg;
      } else {
        console.error(
          '[client-audit-history.component]: not clientId or/and accountId provided as query param in the route'
        );

        this.errorMsg =
          'No fue posible encontrar el id del cliente y/o el de la cuenta.';

        // chart data
        this.scoresReqStatus = REQ_STATUS.ERROR;

        // table data
        this.audits.data && delete this.audits.data;
        this.audits.reqStatus = REQ_STATUS.ERROR;
      }
    });
  }

  periodChange(period: Period): void {
    this.getAudits(
      this.clientID,
      this.account.id,
      period.startDate,
      period.endDate
    );
  }

  getAudits(
    clientID: string,
    accountID: string,
    startDate: string,
    endDate: string
  ): void {
    this.audits.reqStatus = REQ_STATUS.LOADING;
    this.scoresReqStatus = REQ_STATUS.LOADING;

    this.auditService
      .getAudits(clientID, accountID, startDate, endDate)
      .subscribe(
        (resp: any[]) => {
          // account data
          if (!isEmpty(resp)) {
            this.account.id = resp[0].accountId;
            this.account.name = resp[0].accountName;
            this.account.provider = resp[0].provider;
          }

          // table data
          const sortedAuditsData = resp?.sort((a, b) =>
            moment(b.date).diff(moment(a.date))
          );

          this.audits.data = this.parseAuditsData(sortedAuditsData);
          this.audits.reqStatus = REQ_STATUS.SUCCESS;

          // chart data
          this.scores = this.getChartScores(this.audits.data);
          this.scoresReqStatus = REQ_STATUS.SUCCESS;
        },
        (error) => {
          // table data
          this.audits.data = [];
          this.audits.reqStatus = REQ_STATUS.ERROR;

          // chart data
          this.scores = [];
          this.scoresReqStatus = REQ_STATUS.ERROR;
        }
      );
  }

  parseAuditsData(audits: any[]): any[] {
    if (!audits) {
      return [];
    }

    return audits.map((i) => {
      const timestamp = i.date;
      const utcDate = moment.utc(timestamp);
      const tzDate = utcDate.clone().tz('America/Mexico_City');
      i.date = moment(tzDate).format('DD-MM-YYYY');
      i.hour = moment(tzDate).format('HH:mm:ss A');
      i.globalScore = Math.round(i.globalScore);
      return i;
    });
  }

  getChartScores(audits: any[]): ChartLineData[] {
    if (!isEmpty(audits) && audits.length < 2) {
      this.insufficientScores = true;
      return [];
    }

    const data = audits.map((i) => {
      const ms = moment(i.date, 'DD-MM-YYYY').valueOf();
      return { date: ms, value: i.globalScore };
    });

    this.insufficientScores && (this.insufficientScores = false);
    return data.sort((a, b) => a.date - b.date);
  }

  redirectToResults(selection): void {
    const audit = selection.row;
    this.router.navigate(['/dashboard/audit/results'], {
      queryParams: {
        clientId: this.clientID,
        accountId: this.account.id,
        auditId: audit.id,
      },
    });
  }
}

class Account {
  id: string;
  name: string;
  provider: string;
}
