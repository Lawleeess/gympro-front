import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account } from 'src/app/models/account';
import {
  getDiffBtwDates,
  parseISODate,
} from 'src/app/tools/functions/parse-date';
import { TableColumn } from '../../../shared/components/generic-table/generic-table.component';
import { ScriptsService } from '../../services/scripts.service';

@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.scss'],
})
export class HistoricalComponent implements OnInit, OnDestroy {
  accountList: Account[];
  selectedAccount: Account;
  accountsReqStatus = 2;

  historicalTableColumns: TableColumn[] = [
    {
      name: 'id',
      title: 'ID',
    },
    {
      name: 'executed_at',
      title: 'Fecha de ejecución',
    },
    {
      name: 'name',
      title: 'Script ejecutado',
    },
    {
      name: 'result_link',
      title: 'Resultado',
      link: true,
      linkName: 'Ver',
      linkEmpty: 'No se encontraron errores',
    },
    {
      name: 'finished_at',
      title: 'Tiempo de ejecución',
    },
    {
      name: 'status',
      title: 'Status',
      status: true,
    },
  ];

  historical = {
    data: [],
    reqStatus: 0,
  };

  standaloneOption = { name: 'Todas', standalone: true };
  countinueRefresh: any;

  constructor(private scriptsService: ScriptsService) {}

  async ngOnInit(): Promise<any> {
    this.accountList = this.scriptsService.accounts
      ? this.scriptsService.accounts
      : await this.getAccounts();

    this.getHistory(null, true);
    this.getHistoryContinually();
  }

  getHistoryContinually(): void {
    this.countinueRefresh = setTimeout(() => {
      this.getHistory(this.selectedAccount, false);
      this.getHistoryContinually();
    }, 60000);
  }

  getAccounts(): any {
    this.accountsReqStatus = 1;
    return this.scriptsService
      .getAccounts()
      .toPromise()
      .then((accounts: Account[]) => {
        this.scriptsService.accounts = accounts;
        this.accountsReqStatus = 2;
        return accounts;
      })
      .catch((error) => {
        console.error(`[historical.component]: ${error}`);
        this.accountsReqStatus = 3;
        return null;
      });
  }

  getHistory(account?: Account, updateStatus?: boolean): void {
    this.selectedAccount = account;

    updateStatus && (this.historical.reqStatus = 1);

    this.scriptsService.getHistory(this.selectedAccount?.id).subscribe(
      (res: any[]) => {
        if (res?.length > 0) {
          this.historical.data = res.map((item) => {
            return {
              ...item,
              executed_at: parseISODate(item.executed_at),
              finished_at: getDiffBtwDates(item.executed_at, item.finished_at),
              result_link: item.result_link
                ? item.result_link
                : item.status === 'finished'
                ? 'No se encontraron errores'
                : '',
            };
          });
        }

        updateStatus && (this.historical.reqStatus = 2);
      },
      (error) => {
        this.historical.data = [];
        updateStatus && (this.historical.reqStatus = 3);
      }
    );
  }

  ngOnDestroy(): void {
    clearTimeout(this.countinueRefresh);
  }
}
