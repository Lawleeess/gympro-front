import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { REQ_STATUS } from 'src/app/constants/general';
import { MODULES, ROLES } from 'src/app/constants/modules';
import { DEPARTMENTS } from 'src/app/constants/users';
import {
  IconifySettings,
  selectedCell,
  TableColumn,
  TableMediaColumn,
  TableRow,
  UpdatedCell,
} from 'src/app/modules/shared/components/generic-table/generic-table.component';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';
import { downloadCsvFile } from 'src/app/tools/functions/files';
import { getIncrease } from 'src/app/tools/functions/general';
import { Provider } from 'src/app/tools/types/global';
import {
  AccountBudget,
  AddBudgetModal,
  AddBudgetModalComponent,
} from '../../components/add-budget-modal/add-budget-modal.component';
import {
  ConfirmationModal,
  ConfirmationModalComponent,
} from '../../components/confirmation-modal/confirmation-modal.component';
import { OverviewFilters } from '../../components/filters-overview/filters-overview.component';
import { BudgetManagementService } from '../../services/budget-management.service';

@Component({
  selector: 'app-budget-overview',
  templateUrl: './budget-overview.component.html',
  styleUrls: ['./budget-overview.component.scss'],
})
export class BudgetOverviewComponent implements OnInit {
  filters: OverviewFilters = new OverviewFilters();
  investment: any[] = [];
  investmentReqStatus: number = REQ_STATUS.INITIAL;

  accountsTableColumns: TableColumn[] = [
    {
      title: 'Cliente',
      name: 'clientName',
    },
    {
      title: 'Proveedor',
      name: 'providerMedia',
      media: TableMediaColumn['iconify-icon'],
      textAlign: 'center',
      sortingDisabled: true,
    },
    {
      title: 'ID de la cuenta',
      name: 'accountID',
    },
    {
      title: 'Nombre en la plataforma',
      name: 'accountName',
    },
    {
      title: 'Vertical',
      name: 'vertical',
    },
    {
      title: 'Nombre del presupuesto',
      name: 'budgetName',
      emptyLine: true,
    },
    {
      title: 'Fecha inicio',
      name: 'startDate',
      emptyLine: true,
      widthColumn: 4.5,
    },
    {
      title: 'Fecha fin',
      name: 'endDate',
      emptyLine: true,
      widthColumn: 4.5,
    },
    {
      title: 'Presupuesto',
      name: 'budget',
      formatValue: 'currency',
      editable: true,
    },
    {
      title: 'Δ Presupuesto',
      name: 'budgetIncrease',
      media: TableMediaColumn.increment,
      sortingDisabled: true,
    },
    {
      title: 'Fee',
      name: 'fee',
      formatValue: 'percentage',
      editable: false,
    },
    {
      title: 'Δ Fee',
      name: 'feeIncrease',
      media: TableMediaColumn.increment,
      sortingDisabled: true,
    },
    {
      title: 'Gasto en plataforma',
      name: 'platformCost',
      media: TableMediaColumn['progress-bar'],
    },
    {
      title: 'Agregar presupuesto',
      name: 'addBudget',
      textAlign: 'center',
      icon: 'fas fa-plus',
    },
    {
      title: 'Ver histórico',
      name: 'details',
      textAlign: 'center',
      icon: 'fas fa-eye',
    },
  ];

  accounts: Table = new Table();

  constructor(
    private userService: UserService,
    private budgetManagementService: BudgetManagementService,
    private router: Router,
    private dialog: MatDialog,
    private snackService: SnackBarService
  ) {
    this.loadViewAccordingPermissions();
  }

  loadViewAccordingPermissions(): void {
    const user = this.userService.user;
    const userRole = this.userService.getUserRole(
      this.userService.user,
      MODULES.budgetManagement.id
    );

    if (userRole !== ROLES.admin.id) {
      this.accountsTableColumns = this.accountsTableColumns.map((i) => {
        return { ...i, editable: false };
      });
    }

    if (
      userRole === ROLES.admin.id
    ) {
      const feeColumn = this.accountsTableColumns.find((i) => i.name === 'fee');
      feeColumn.editable = true;
    }
  }

  ngOnInit(): void {}

  filterChange(filters: OverviewFilters): void {
    this.filters = filters;
    this.getAccounts();
  }

  getAccounts(): void {
    this.accounts.reqStatus = REQ_STATUS.LOADING;
    this.budgetManagementService
      .getAccounts(this.filters.year, this.filters.month, this.filters.clientID)
      .subscribe(
        (resp: any[]) => {
          if (!!resp) {
            this.accounts.data = resp.map((i) => {
              return {
                ...i,
                id: i.accountID,
                providerMedia: this.getProviderMediaIcon(i.provider),
              };
            });
          } else {
            this.accounts.data = [];
          }
          this.accounts.reqStatus = REQ_STATUS.SUCCESS;
        },
        (error) => {
          console.error(error);
          this.accounts.data = [];
          this.accounts.reqStatus = REQ_STATUS.ERROR;
        }
      );
  }

  getProviderMediaIcon(provider: Provider): IconifySettings {
    const providerMedia: IconifySettings = new IconifySettings();
    switch (provider) {
      case 'adwords':
        providerMedia.dataIcon = 'logos:google-ads';
        break;

      case 'facebook':
        providerMedia.dataIcon = 'logos:facebook';
        break;

      default:
        break;
    }

    return providerMedia;
  }

  getTypeChanges(propertyName: string): 'budget' | 'fee' {
    let typeChange: 'budget' | 'fee';

    if (propertyName === 'budget') {
      typeChange = 'budget';
    } else if (propertyName === 'fee') {
      typeChange = 'fee';
    }

    return typeChange;
  }

  handleSelection(selection: selectedCell) {
    const { columnName, row } = selection;

    if (columnName === 'details') {
      this.redirectToHistory(row);
    } else if (columnName == 'addBudget') {
      this.handleNewBudgetAddition(row);
    }
  }

  redirectToHistory(account) {
    this.router.navigate(['/dashboard/budgets/history'], {
      queryParams: {
        clientId: account.clientID,
        accountId: account.accountID,
      },
    });
  }

  handleNewBudgetAddition(account) {
    const data: AddBudgetModal = {
      account: {
        id: account.accountID,
        name: account.accountName,
        clientName: account.clientName,
        provider: account.provider,
      },
    };

    const dialogRef = this.dialog.open(AddBudgetModalComponent, {
      data,
      panelClass: 'md-width-dialog',
    });

    dialogRef.afterClosed().subscribe((modalResp) => {
      if (typeof modalResp === 'object' && modalResp.budget) {
        this.addNewBudgetForAccount(
          account.clientID,
          account.accountID,
          account.accountName,
          modalResp
        );
      }
    });
  }

  addNewBudgetForAccount(
    clientID: string,
    accountID: string,
    accountName: string,
    budgetInfo: AccountBudget
  ) {
    this.accounts.reqStatus = 1;
    this.budgetManagementService
      .addNewBudgetForAccount(clientID, accountID, accountName, budgetInfo)
      .subscribe(
        (resp) => {
          this.snackService.loadSnackBar(
            `El presupuesto se ha agregado correctamente.`
          );
          this.getAccounts();
        },
        (error) => {
          console.error(error);
          this.snackService.loadSnackBar(
            `Error al agregar el presupuesto. Por favor, intenta nuevamente.`
          );
          this.accounts.reqStatus = 2;
        }
      );
  }

  handleUpdate(changes: UpdatedCell): void {
    const typeChange = this.getTypeChanges(changes.updatedProperty);
    const account: any = changes.updatedItem;

    const data: ConfirmationModal = {
      type: typeChange,
      question: `Estas seguro que quieres cambiar el ${
        typeChange === 'budget' ? 'presupuesto' : 'fee'
      } a:`,
      value: Number(changes.updatedItem[typeChange]),
      account: {
        id: account.accountID,
        name: account.accountName,
        clientName: account.clientName,
        provider: account.provider,
      },
    };

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data,
      panelClass: 'md-width-dialog',
    });

    dialogRef.afterClosed().subscribe((modalResp) => {
      if (modalResp === true) {
        this.updateAccount(
          account.clientID,
          account.accountID,
          typeChange,
          account[typeChange],
          account.budgetName
        );
      }
    });
  }

  updateAccount(
    clientID: string,
    accountID: string,
    propertyToChange: 'budget' | 'fee',
    value: number,
    budgetName: string
  ): void {
    this.accounts.reqStatus = 1;
    this.budgetManagementService
      .updateAccount(clientID, accountID, propertyToChange, value, budgetName)
      .subscribe(
        () => {
          this.snackService.loadSnackBar(
            `El ${
              propertyToChange === 'budget' ? 'presupuesto' : 'fee'
            } se ha actualizado correctamente.`
          );
          this.getAccounts();
        },
        (error) => {
          console.error(error);
          this.snackService.loadSnackBar(
            `Error al actualizar el ${
              propertyToChange === 'budget' ? 'presupuesto' : 'fee'
            }. Por favor, intenta nuevamente.`
          );
          this.accounts.reqStatus = 2;
        }
      );
  }

  exportDataToCSV() {
    const parsedData = this.parseDataForCsv(this.accounts.data);

    const month = String(this.filters.month).padStart(2, '0');

    const clientName: string = this.filters.clientName?.replace(/ /g, '-');

    const fileName: string = `cuentas${!!clientName ? `_${clientName}` : ''}_${
      this.filters.year
    }/${month}`;

    downloadCsvFile(parsedData, fileName);
  }

  parseDataForCsv(data): any[] {
    const newData = data.map((i) => {
      let budgetIncreasePercentage: number = getIncrease(
        i.budgetIncrease.newValue,
        i.budgetIncrease.previousValue
      );
      let feeIncreasePercentage: number = getIncrease(
        i.feeIncrease.newValue,
        i.feeIncrease.previousValue
      );

      return {
        id_cliente: i.clientID,
        nombre_cliente: i.clientName,
        proveedor: i.provider,
        id_cuenta: i.accountID,
        nombre_cuenta: i.accountName,
        vertical: i.vertical,
        presupuesto_actual: i.budget,
        presupuesto_anterior: i.budgetIncrease.previousValue,
        presupuesto_incremento:
          i.budgetIncrease.newValue - i.budgetIncrease.previousValue,
        presupuesto_incremento_porcentual: Number(
          budgetIncreasePercentage.toFixed(2)
        ),
        fee_actual: i.fee,
        fee_anterior: i.feeIncrease.previousValue,
        fee_incremento: Number(feeIncreasePercentage.toFixed(2)),
        gasto_en_plataforma: Number(i.platformCost.toFixed(2)),
      };
    });
    return newData || [];
  }
}

class Table {
  data: TableRow[];
  reqStatus: number;
}
