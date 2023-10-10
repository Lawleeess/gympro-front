import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { REQ_STATUS } from 'src/app/constants/general';
import {
  TableColumn,
  TableMediaColumn,
} from 'src/app/modules/shared/components/generic-table/generic-table.component';
import { AuditService } from '../../services/audit.service';
import isEmpty from 'lodash-es/isEmpty';
import { Period } from 'src/app/models/general';
import 'moment-timezone';
import * as moment from 'moment';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
  clients: any[] = [];
  clientsReqStatus: number = REQ_STATUS.INITIAL;

  clientsTableColumns: TableColumn[] = [
    {
      name: 'name',
      title: 'Cliente',
    },
    {
      name: 'investment',
      title: 'Inversión',
      formatValue: 'currency',
      textAlign: 'center',
    },
    {
      name: 'auditTargetValue',
      title: 'Calificación',
      formatValue: 'percentage',
      decimalInValues: 0,
      textAlign: 'center',
      media: TableMediaColumn.indicator,
      indicatorTooltipPrefix: 'Calificación objetivo: ',
      indicatorTooltipSuffix: '%',
      sortingDisabled: true,
    },
    {
      name: 'timeSerieScore',
      title: 'Calificación a través del tiempo',
      media: TableMediaColumn['chart-line'],
      widthColumn: 13,
      chartLineSettings: {
        dateRefName: 'date',
        valueRefName: 'value',
      },
    },
    {
      name: "lastVariationAuditScore",
      title: "Fecha de último cambio"
    },
    {
      name: 'details',
      textAlign: 'center',
      icon: 'fas fa-eye',
    },
  ];

  constructor(private auditService: AuditService, private router: Router) {}

  ngOnInit(): void {}

  periodChange(period: Period): void {
    this.getClients(period.startDate, period.endDate);
  }

  getClients(startDate: string, endDate: string): void {
    this.clientsReqStatus = REQ_STATUS.LOADING;

    this.auditService.getClients(startDate, endDate).subscribe(
      (resp: any[]) => {
        if (!isEmpty(resp)) {
          this.clients = this.parseClientsAuditsDates(resp)
        } else {
          this.clients = [];
        }

        this.clientsReqStatus = REQ_STATUS.SUCCESS;
      },
      (error) => {
        this.clients = [];
        console.error(error);
        this.clientsReqStatus = REQ_STATUS.ERROR;
      }
    );
  }

  parseClientsAuditsDates(clients: any[]): any[] {
    return clients.map((i) => {
      if (!!i.lastVariationAuditScore) {
        const timestamp = i.lastVariationAuditScore;
        const utcDate = moment.utc(timestamp);
        const tzDate = utcDate.clone().tz('America/Mexico_City');
        i.lastVariationAuditScore = moment(tzDate).format('DD-MM-YYYY HH:mm:ss A');
      }
      return i;
    });
  }

  redirectToAccounts(selection): void {
    const client = selection.row;
    this.router.navigate(['/dashboard/audit/accounts'], {
      queryParams: {
        clientId: client.id,
      },
    });
  }
}
