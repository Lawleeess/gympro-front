import { Component, Input, OnInit } from '@angular/core';
import { REQ_STATUS } from 'src/app/constants/general';
import { TableColumn } from 'src/app/modules/shared/components/generic-table/generic-table.component';
import { isEmpty } from 'lodash-es';
import { AuditService } from '../../services/audit.service';

@Component({
  selector: 'app-panel-result',
  templateUrl: './panel-result.component.html',
  styleUrls: ['./panel-result.component.scss'],
})
export class PanelResultComponent implements OnInit {
  @Input() clientID: string;
  @Input() accountID: string;
  @Input() auditID: string;
  @Input() result: any;

  campaignTableColumns: TableColumn[] = [
    {
      name: 'campaignID',
      title: 'ID de la campaña',
    },
    {
      name: 'campaignName',
      title: 'Nombre de la campaña',
    },
    {
      name: 'description',
      title: 'Descripción',
    },
  ];

  adsetTableColumns: TableColumn[] = [
    {
      name: 'campaignID',
      title: 'ID de la campaña',
    },
    {
      name: 'campaignName',
      title: 'Nombre de la campaña',
    },
    {
      name: 'adsetID',
      title: 'ID del adset',
    },
    {
      name: 'adsetName',
      title: 'Nombre del adset',
    },
    {
      name: 'description',
      title: 'Descripción',
    },
  ];

  adTableColumns: TableColumn[] = [
    {
      name: 'campaignID',
      title: 'ID de la campaña',
    },
    {
      name: 'campaignName',
      title: 'Nombre de la campaña',
    },
    {
      name: 'adsetID',
      title: 'ID del adset',
    },
    {
      name: 'adsetName',
      title: 'Nombre del adset',
    },
    {
      name: 'adName',
      title: 'Nombre del ad',
    },
    {
      name: 'description',
      title: 'Descripción',
    },
  ];

  tableColumns: TableColumn[];

  tableResults = {
    data: [],
    reqStatus: REQ_STATUS.INITIAL,
  };

  constructor(private auidtService: AuditService) {}

  ngOnInit(): void {}

  getTableColumns(tableType: string): TableColumn[] {
    switch (tableType) {
      case 'campaign':
        return this.campaignTableColumns;

      case 'adset':
        return this.adsetTableColumns;

      case 'ad':
        return this.adTableColumns;

      default:
        return null;
    }
  }

  openPanel() {
    if (isEmpty(this.tableResults.data)) {
      this.tableResults.reqStatus = REQ_STATUS.LOADING;

      this.tableColumns = this.getTableColumns(this.result.level);

      this.auidtService
        .getAuditDetails(
          this.clientID,
          this.accountID,
          this.auditID,
          this.result.id
        )
        .subscribe(
          (resp: any) => {
            this.tableResults.data = resp.results;
            this.tableResults.reqStatus = REQ_STATUS.SUCCESS;
          },
          (error) => {
            console.error(error);
            this.tableResults.reqStatus = REQ_STATUS.ERROR;
          }
        );
    }
  }
}
