import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  CUSTOMER_CREDENTIAL_EMAIL,
  CUSTOMER_CURRENCY_CODES,
  CUSTOMER_PROVIDERS,
  CUSTOMER_TIME_ZONES,
} from 'src/app/constants/custumers';
import { REQ_STATUS } from 'src/app/constants/general';
import {
  AdwordsAccount,
  AnalyticsAccount,
  BingAccount,
  FacebookAccount,
  GA4Account,
  TikTokAccount,
  LinkedinAccount,
} from 'src/app/models/customer';
import { selectItem } from 'src/app/modules/shared/components/generic-select/generic-select.component';
import { TableColumn } from 'src/app/modules/shared/components/generic-table/generic-table.component';
import { UsersManagementService } from 'src/app/modules/users-management/services/users-management.service';
import { titleCase } from 'src/app/tools/functions/parse-string';

@Component({
  selector: 'app-form-new-customer-accounts',
  templateUrl: './form-new-customer-accounts.component.html',
  styleUrls: ['./form-new-customer-accounts.component.scss'],
})
export class FormNewCustomerAccountsComponent implements OnInit, OnDestroy {
  private _savedAccounts: Account[];

  get savedAccounts(): Account[] {
    return this._savedAccounts;
  }

  @Input() set savedAccounts(value: Account[]) {
    this._savedAccounts = value;
    this.loadAccountsData();
  }

  private _disableActions: boolean = false;

  get disableActions(): boolean {
    return this._disableActions;
  }

  @Input() set disableActions(value: boolean) {
    this._disableActions = value;
    this.loadTablesColumns();
  }

  @Output() accountsChange = new EventEmitter<Account[]>();

  CREDENTIALS = CUSTOMER_CREDENTIAL_EMAIL;
  CREDENTIAL_AD_FB_TT = CUSTOMER_CREDENTIAL_EMAIL.filter((i) => i.id == 1);
  TIMEZONES = CUSTOMER_TIME_ZONES;
  CURRENCIES = CUSTOMER_CURRENCY_CODES;

  dataTableColumns: TableColumn[] = [
    {
      name: 'credentialEmail',
      title: 'Email de la credential',
    },
    {
      name: 'accountID',
      title: 'ID de la cuenta',
    },
    {
      name: 'name',
      title: 'Nombre de la cuenta',
    },
    {
      name: 'propertyID',
      title: 'ID de la propiedad',
    },
    {
      name: 'viewID',
      title: 'ID de la vista',
    },
    {
      name: 'timezone',
      title: 'Zona horaria',
    },
    {
      name: 'currency',
      title: 'Moneda',
    },
    {
      name: 'managerName',
      title: 'Manager',
    },
    {
      name: 'vertical',
      title: 'Vertical',
    },
    {
      name: 'businessUnit',
      title: 'Unidad de negocio',
    },
    {
      name: 'objective',
      title: 'Objetivo',
    },
  ];
  actionsTableColumns: TableColumn[] = [
    {
      name: TableAction.update,
      title: '',
      textAlign: 'center',
      icon: 'fas fa-edit',
    },
    {
      name: TableAction.delete,
      title: '',
      textAlign: 'center',
      icon: 'fas fa-trash-alt',
    },
  ];

  accountsTableColumns: TableColumn[] = [...this.dataTableColumns];
  accountsAdTableColumns: TableColumn[];
  accountsGaTableColumns: TableColumn[];
  accountsFbTableColumns: TableColumn[];
  accountsBgTableColumns: TableColumn[];
  accountsTtTableColumns: TableColumn[];
  accountsGA4TableColumns: TableColumn[];
  accountsLinTableColumns: TableColumn[];

  formAd: FormGroup; // Adwords accounts form
  formGa: FormGroup; // Analytics accounts form
  formFb: FormGroup; // Facebook accounts form
  formBg: FormGroup; // Bing accounts form
  formTt: FormGroup; // TikTok accounts form
  formGa4: FormGroup; // GA4 accounts form
  formLin: FormGroup; // GA4 accounts form

  formSub: Subscription;

  accounts: AccountsTables = {
    ad: {
      data: [],
      reqStatus: 2,
    },
    ga: {
      data: [],
      reqStatus: 2,
    },
    fb: {
      data: [],
      reqStatus: 2,
    },
    bg: {
      data: [],
      reqStatus: 2,
    },
    tt: {
      data: [],
      reqStatus: 2,
    },
    ga4: {
      data: [],
      reqStatus: 2,
    },
    lin: {
      data: [],
      reqStatus: 2,
    },
  };

  showFormAd: boolean = true;
  showFormGa: boolean = true;
  showFormFb: boolean = true;
  showFormBg: boolean = true;
  showFormTt: boolean = true;
  showFormGa4: boolean = true;
  showFormLin: boolean = true;

  editableAccountAd: AdwordsAccount;
  editableAccountGa: AnalyticsAccount;
  editableAccountFb: FacebookAccount;
  editableAccountBg: BingAccount;
  editableAccountTt: TikTokAccount;
  editableAccountGa4: GA4Account;
  editableAccountLin: LinkedinAccount;

  managers: any[] = [];
  managersReqStatus: number = REQ_STATUS.INITIAL;
  selectedManagers: ManagerSelection = new ManagerSelection();

  constructor(
    private formBuilder: FormBuilder,
    private userManagementService: UsersManagementService
  ) {}

  ngOnInit(): void {
    this.getManagersList();

    this.formAd = this.formBuilder.group({
      credentialEmail: ['', Validators.required],
      accountID: ['', Validators.required],
      name: ['', Validators.required],
      timezone: ['', Validators.required],
      currency: ['', Validators.required],
      manager: ['', Validators.required],
      vertical: ['', Validators.required],
      businessUnit: ['', Validators.required],
      objective: ['', Validators.required],
    });

    this.formGa = this.formBuilder.group({
      credentialEmail: ['', Validators.required],
      accountID: ['', Validators.required],
      name: ['', Validators.required],
      propertyID: ['', Validators.required],
      viewID: ['', Validators.required],
      timezone: ['', Validators.required],
      currency: ['', Validators.required],
      manager: ['', Validators.required],
      vertical: ['', Validators.required],
      businessUnit: ['', Validators.required],
      objective: ['', Validators.required],
    });

    this.formFb = this.formBuilder.group({
      credentialEmail: ['', Validators.required],
      accountID: ['', Validators.required],
      name: ['', Validators.required],
      timezone: ['', Validators.required],
      currency: ['', Validators.required],
      manager: ['', Validators.required],
      vertical: ['', Validators.required],
      businessUnit: ['', Validators.required],
      objective: ['', Validators.required],
    });

    this.formBg = this.formBuilder.group({
      credentialEmail: ['', Validators.required],
      accountID: ['', Validators.required],
      name: ['', Validators.required],
      timezone: ['', Validators.required],
      currency: ['', Validators.required],
      manager: ['', Validators.required],
      vertical: ['', Validators.required],
      businessUnit: ['', Validators.required],
      objective: ['', Validators.required],
    });

    this.formTt = this.formBuilder.group({
      credentialEmail: ['', Validators.required],
      accountID: ['', Validators.required],
      name: ['', Validators.required],
      timezone: ['', Validators.required],
      currency: ['', Validators.required],
      manager: ['', Validators.required],
      vertical: ['', Validators.required],
      businessUnit: ['', Validators.required],
      objective: ['', Validators.required],
    });

    this.formGa4 = this.formBuilder.group({
      credentialEmail: ['', Validators.required],
      accountID: ['', Validators.required],
      name: ['', Validators.required],
      propertyID: ['', Validators.required],
      timezone: ['', Validators.required],
      currency: ['', Validators.required],
      manager: ['', Validators.required],
      vertical: ['', Validators.required],
      businessUnit: ['', Validators.required],
      objective: ['', Validators.required],
    });

    this.formLin = this.formBuilder.group({
      credentialEmail: ['', Validators.required],
      accountID: ['', Validators.required],
      name: ['', Validators.required],
      timezone: ['', Validators.required],
      currency: ['', Validators.required],
      manager: ['', Validators.required],
      vertical: ['', Validators.required],
      businessUnit: ['', Validators.required],
      objective: ['', Validators.required],
    });

    const tableColumnsWithoutGaProps = this.accountsTableColumns.filter(
      (i) => i.name !== 'propertyID' && i.name !== 'viewID'
    );
    const tableColumnsWithoutGaViewID = this.accountsTableColumns.filter(
      (i) => i.name !== 'viewID'
    );

    this.accountsAdTableColumns = [...tableColumnsWithoutGaProps];
    this.accountsFbTableColumns = [...tableColumnsWithoutGaProps];
    this.accountsBgTableColumns = [...tableColumnsWithoutGaProps];
    this.accountsTtTableColumns = [...tableColumnsWithoutGaProps];
    this.accountsGaTableColumns = [...this.accountsTableColumns];
    this.accountsGA4TableColumns = [...tableColumnsWithoutGaViewID];
    this.accountsLinTableColumns = [...tableColumnsWithoutGaProps];
  }

  async getManagersList() {
    try {
      const resp = await this.userManagementService.getAllUsers();
      this.managers = resp.map((i) => ({ id: i.id, name: i.name }));
      this.managersReqStatus = REQ_STATUS.SUCCESS;
    } catch (error) {
      console.error(error);
      this.managers = [];
      this.managersReqStatus = REQ_STATUS.ERROR;
    }
  }

  loadTablesColumns(): void {
    if (this.disableActions) {
      this.accountsTableColumns = [...this.dataTableColumns];
    } else {
      this.accountsTableColumns = [
        ...this.dataTableColumns,
        ...this.actionsTableColumns,
      ];
    }
  }

  loadAccountsData(): void {
    this.accounts.ad.data = [];
    this.accounts.ga.data = [];
    this.accounts.fb.data = [];
    this.accounts.bg.data = [];
    this.accounts.tt.data = [];
    this.accounts.ga4.data = [];
    this.accounts.lin.data = [];

    if (this.savedAccounts?.length > 0) {
      for (const savedAccount of this.savedAccounts) {
        const account = { ...savedAccount };
        account.managerName = account.manager?.name;

        switch (account.provider) {
          case CUSTOMER_PROVIDERS.ad.name:
            this.accounts.ad.data.push(account);
            break;

          case CUSTOMER_PROVIDERS.ga.name:
            this.accounts.ga.data.push(account);
            break;

          case CUSTOMER_PROVIDERS.fb.name:
            this.accounts.fb.data.push(account);
            break;

          case CUSTOMER_PROVIDERS.bg.name:
            this.accounts.bg.data.push(account);
            break;
          case CUSTOMER_PROVIDERS.tt.name:
            this.accounts.tt.data.push(account);
            break;
          case CUSTOMER_PROVIDERS.ga4.name:
            this.accounts.ga4.data.push(account);
            break;
          case CUSTOMER_PROVIDERS.lin.name:
            this.accounts.lin.data.push(account);
            break;
          default:
            break;
        }
      }

      if (this.accounts.ad.data.length > 0) {
        this.showFormAd = false;
      }

      if (this.accounts.ga.data.length > 0) {
        this.showFormGa = false;
      }

      if (this.accounts.fb.data.length > 0) {
        this.showFormFb = false;
      }

      if (this.accounts.bg.data.length > 0) {
        this.showFormBg = false;
      }

      if (this.accounts.tt.data.length > 0) {
        this.showFormTt = false;
      }

      if (this.accounts.ga4.data.length > 0) {
        this.showFormGa4 = false;
      }

      if (this.accounts.lin.data.length > 0) {
        this.showFormLin = false;
      }
    }
  }

  selectAccount(provider: Provider, selection) {
    const account = selection.row;
    const action = selection.columnName;
    if (action === TableAction.update) {
      this.selectAccountToEdit(provider, account);
    } else if (action === TableAction.delete) {
      this.removeAccount(provider, account);
    }
  }

  selectAccountToEdit(provider: Provider, account: Account): void {
    this.changeFormVisibility(provider, true);
    const formRef = `form${titleCase(provider)}`;
    const editableAccountRef = `editableAccount${titleCase(provider)}`;

    this[editableAccountRef] = account;
    const selectedManager: Manager = this.managers.find(
      (i) => i.id === account.manager?.userID
    );

    this[formRef].patchValue({
      credentialEmail: this.CREDENTIALS.find(
        (i) => i.name == account.credentialEmail
      ),
      accountID: account.accountID,
      name: account.name,
      objective: account.objective,
      vertical: account.vertical,
      businessUnit: account.businessUnit,
      timezone: this.TIMEZONES.find((i) => i.id == account.timezone),
      currency: this.CURRENCIES.find((i) => i.id == account.currency),
      manager: selectedManager,
    });

    if (provider === CUSTOMER_PROVIDERS.ga.id) {
      this.formGa.patchValue({
        propertyID: account['propertyID'],
        viewID: account['viewID'],
      });
    }
    if (provider === CUSTOMER_PROVIDERS.ga4.id) {
      this.formGa4.patchValue({
        propertyID: account['propertyID'],
      });
    }
    this.selectedManagers[provider] = selectedManager;
  }

  removeAccount(provider: Provider, account: Account): void {
    this.accounts[provider].data = this.accounts[provider].data.filter(
      (i) => i.accountID !== account.accountID
    );

    if (this.accounts[provider].data.length === 0) {
      this.changeFormVisibility(provider, true);
    }
    this.applyAccountsSelection();
  }

  handleAccount(provider: Provider, formDirective: FormGroupDirective): void {
    const formRef = `form${titleCase(provider)}`;
    if (!this[formRef].valid) {
      return;
    }
    const editableAccountRef = `editableAccount${titleCase(provider)}`;
    if (!this[editableAccountRef]) {
      this.addAccount(provider, formRef, formDirective);
    } else {
      this.editAccount(provider, formRef, formDirective);
    }
  }

  addAccount(
    provider: Provider,
    formRef: string,
    formDirective: FormGroupDirective
  ): void {
    const account = { ...this[formRef].value };
    const flagFormRef = `showForm${titleCase(provider)}`;
    account.provider = CUSTOMER_PROVIDERS[provider].name;
    account.credentialEmail = account.credentialEmail.name;
    account.timezone = account.timezone.id;
    account.currency = account.currency.id;
    account.manager = {
      userID: account.manager.id,
      name: account.manager.name,
    };
    // auxID property is only used in frontend to distinguish
    // when an account not saved in the database is edited
    account.auxID = Date.now();

    this.accounts[provider].data = [...this.accounts[provider].data, account];
    this[flagFormRef] = false;

    this[formRef].reset();
    formDirective.resetForm();
    this.selectedManagers[provider] = null;
    this.applyAccountsSelection();
  }

  editAccount(
    provider: Provider,
    formRef: string,
    formDirective: FormGroupDirective
  ): void {
    const editableAccountRef = `editableAccount${titleCase(provider)}`;
    const flagFormRef = `showForm${titleCase(provider)}`;

    const editableAccount = this[editableAccountRef]; // original account
    const editedAccount = { ...this[formRef].value }; // account with changes made in form
    let account:
      | AdwordsAccount
      | FacebookAccount
      | AnalyticsAccount
      | BingAccount
      | TikTokAccount
      | GA4Account
      | LinkedinAccount;

    if (editableAccount.postgresID) {
      // account saved previously in DB
      account = this.accounts[provider].data.find(
        (i) => i.postgresID === editableAccount.postgresID
      );
    } else if (editableAccount.auxID) {
      // account added in the accounts list but not saved in DB
      account = this.accounts[provider].data.find(
        (i) => i.auxID === editableAccount.auxID
      );
    } else {
      console.error(
        '[form-new-customer-accounts.component]: Edited account is not found in accounts list'
      );
      return;
    }

    account.credentialEmail = editedAccount.credentialEmail.name;
    account.accountID = editedAccount.accountID;
    account.name = editedAccount.name;
    account.timezone = editedAccount.timezone.id;
    account.currency = editedAccount.currency.id;
    account.vertical = editedAccount.vertical;
    account.businessUnit = editedAccount.businessUnit;
    account.objective = editedAccount.objective;
    account.manager = {
      userID: editedAccount.manager.id,
      name: editedAccount.manager.name,
    };
    account.managerName = editedAccount.manager.name;

    if (account.provider === CUSTOMER_PROVIDERS.ga.name) {
      account['propertyID'] = editedAccount.propertyID;
      account['viewID'] = editedAccount.viewID;
    }

    if (account.provider === CUSTOMER_PROVIDERS.ga4.name) {
      account['propertyID'] = editedAccount.propertyID;
    }

    this[flagFormRef] = false;
    this[formRef].reset();
    formDirective.resetForm();
    this.selectedManagers[provider] = null;
    delete this[editableAccountRef];

    this.applyAccountsSelection();
  }

  cancelAccountAction(provider: Provider, formDirective: FormGroupDirective) {
    const editableAccountRef = `editableAccount${titleCase(provider)}`;
    this[editableAccountRef] && delete this[editableAccountRef];

    this.selectedManagers[provider] = null;

    this.changeFormVisibility(provider, false);

    const formRef = `form${titleCase(provider)}`;
    this[formRef].reset();
    formDirective.resetForm();
  }

  applyAccountsSelection(): void {
    const accounts = [
      ...this.accounts.ad.data,
      ...this.accounts.ga.data,
      ...this.accounts.fb.data,
      ...this.accounts.bg.data,
      ...this.accounts.tt.data,
      ...this.accounts.ga4.data,
      ...this.accounts.lin.data,
    ];

    this.accountsChange.emit(accounts);
  }

  changeFormVisibility(provider: Provider, state: boolean): void {
    const flagFormRef = `showForm${titleCase(provider)}`;
    this[flagFormRef] = state;
  }

  managerChange(provider: Provider, manager: selectItem) {
    const formRef = `form${titleCase(provider)}`;
    const selectedManager = this.managers.find((i) => i.id === manager.id);
    this[formRef].patchValue({
      manager: selectedManager,
    });
  }

  ngOnDestroy(): void {
    this.formSub?.unsubscribe();
  }
}

type Provider = 'ad' | 'ga' | 'fb' | 'bg' | 'tt' | 'ga4' | 'lin';

export type Account =
  | AdwordsAccount
  | AnalyticsAccount
  | FacebookAccount
  | BingAccount
  | TikTokAccount
  | GA4Account
  | LinkedinAccount;

interface AccountsTables {
  ad: AccountTable;
  ga: AccountTable;
  fb: AccountTable;
  bg: AccountTable;
  tt: AccountTable;
  ga4: AccountTable;
  lin: AccountTable;
}
interface AccountTable {
  data: Account[];
  reqStatus: number;
}
class ManagerSelection {
  ad: Manager;
  ga: Manager;
  fb: Manager;
  bg: Manager;
  tt: Manager;
  ga4: Manager;
  lin: Manager;
}

interface Manager {
  userID: string;
  name: string;
}

export const TableAction = {
  update: 'update',
  delete: 'delete',
};
