import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { REQ_STATUS } from 'src/app/constants/general';
import { AuditService } from '../../services/audit.service';
import { Provider } from 'src/app/models/account';
import { PROVIDERS } from 'src/app/constants/accounts';
import {
  TableColumn,
  TableMediaColumn,
} from 'src/app/modules/shared/components/generic-table/generic-table.component';
import isEmpty from 'lodash-es/isEmpty';
import { Period } from '../../components/period-filter/period-filter.component';
import { Providers } from 'src/app/enums/general';
import { Option } from 'src/app/models/general';
import { PreferenceDetails, PreferenceTypes } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { MODULES, PAGES } from 'src/app/constants/modules';

@Component({
  selector: 'app-client-accounts',
  templateUrl: './client-accounts.component.html',
  styleUrls: ['./client-accounts.component.scss'],
})
export class ClientAccountsComponent implements OnInit {
  client: Client = new Client();
  accounts: any[];
  accountsReqStatus: number = REQ_STATUS.INITIAL;

  providers: Option[] = [{ value: 'all', label: 'Todos' }, ...PROVIDERS];
  selectedProvider: string | Providers = 'all';
  selectedPeriod: Period;
  accountsTableColumns: TableColumn[] = [
    {
      name: 'name',
      title: 'Cuenta',
    },
    {
      name: 'provider',
      title: 'Proveedor',
      textPipe: 'titlecase',
    },
    {
      name: 'investment',
      title: 'Inversión',
      formatValue: 'currency',
      textAlign: 'center',
    },
    {
      name: 'globalScore',
      title: 'Calificación',
      formatValue: 'percentage',
      decimalInValues: 0,
      textAlign: 'center',
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
      name: 'details',
      textAlign: 'center',
      icon: 'fas fa-eye',
    },
  ];

  errorMsg: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auditService: AuditService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (!!params.clientId) {
        this.client.id = params.clientId;
        this.errorMsg && delete this.errorMsg;
      } else {
        console.error(
          '[client-accounts.component]: not clientId provided as query param in the route'
        );

        this.errorMsg = 'No fue posible encontrar el id del cliente.';
        this.accountsReqStatus = REQ_STATUS.ERROR;
      }
    });
  }



  getAccounts(
    clientID: string,
    startDate: string,
    endDate: string,
    provider: string
  ): void {
    this.accountsReqStatus = REQ_STATUS.LOADING;

    this.auditService
      .getAccounts(clientID, startDate, endDate, provider)
      .subscribe(
        (resp: any) => {
          if (!isEmpty(resp)) {
            this.client.name = resp.clientName;
            this.accounts = resp.accounts;
          } else {
            this.client.name = null;
            this.accounts = [];
          }

          this.accountsReqStatus = REQ_STATUS.SUCCESS;
        },
        (error) => {
          this.client.name = null;
          this.accounts = [];
          console.error(error);
          this.accountsReqStatus = REQ_STATUS.ERROR;
        }
      );
  }

  periodChange(period: Period) {
    this.selectedPeriod = period;
    let provider: string = this.getProviderSelection();

    this.getAccounts(
      this.client.id,
      this.selectedPeriod.startDate,
      this.selectedPeriod.endDate,
      provider
    );
  }

  providerChange() {
    let provider: string = this.getProviderSelection();
    this.saveSelectionInUserPreferences(this.selectedProvider);

    this.getAccounts(
      this.client.id,
      this.selectedPeriod.startDate,
      this.selectedPeriod.endDate,
      provider
    );
  }

  getProviderSelection(): string {
    let provider: string;
    if (this.selectedProvider !== 'all') {
      provider = this.selectedProvider;
    }
    return provider;
  }

  redirectToHistory(selection): void {
    const account = selection.row;
    this.router.navigate(['/dashboard/audit/history'], {
      queryParams: {
        clientId: this.client.id,
        accountId: account.id,
      },
    });
  }

  saveSelectionInUserPreferences(selectedProvider: string | Providers) {
    const preference: PreferenceDetails = {
      name: 'provider',
      type: PreferenceTypes.filterOption,
      value: selectedProvider,
    };
  }
}

class Client {
  id: string;
  name: string;
}
