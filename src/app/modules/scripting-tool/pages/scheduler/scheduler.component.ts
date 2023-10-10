import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FREQUENCIES, SCRIPTS } from 'src/app/constants/scripts';
import { Account } from 'src/app/models/account';
import { ScheduledScript } from 'src/app/models/script';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { TableColumn } from '../../../shared/components/generic-table/generic-table.component';
import { ScriptsService } from '../../services/scripts.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
})
export class SchedulerComponent implements OnInit, OnDestroy {
  accountList: Account[];
  scriptList: any[] = SCRIPTS;
  frequencyList: any[] = FREQUENCIES;

  selectedAccount: Account;
  selectedScript;
  selectedFrequency;
  resetNewScriptFields: boolean;

  accountsReqStatus = 2;

  newScript: boolean; // to show or hide new script form
  scriptReqStatus = 0;

  schedulerTableColumns: TableColumn[] = [
    {
      name: 'name',
      title: 'Script',
    },
    {
      name: 'description',
      title: 'Descripción',
    },
    {
      name: 'parsed_frequency',
      title: 'Frecuencia',
    },
    {
      name: 'version',
      title: 'Versión',
    },
    {
      name: 'delete',
      title: '',
      textAlign: 'center',
      icon: 'fas fa-trash-alt',
    },
  ];

  scheduler = {
    data: [],
    reqStatus: 2,
  };

  constructor(
    private dialog: MatDialog,
    private scriptsService: ScriptsService,
    private snackService: SnackBarService
  ) {}

  async ngOnInit(): Promise<any> {
    this.accountList = this.scriptsService.accounts
      ? this.scriptsService.accounts
      : await this.getAccounts();
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
        console.error(`[scheduler.component]: ${error}`);
        this.accountsReqStatus = 3;
        return null;
      });
  }

  getAccountScripts(account: Account): void {
    this.scheduler.reqStatus = 1;

    this.selectedAccount = account;
    this.scriptsService.getAccountScripts(this.selectedAccount.id).subscribe(
      (scripts: ScheduledScript[]) => {
        if (scripts) {
          this.scheduler.data = scripts.map((item) => {
            return {
              ...item,
              parsed_frequency: FREQUENCIES.find(
                (f) => f.cronExpression === item.frequency
              )?.name,
            };
          });
        } else {
          this.scheduler.data = [];
        }

        this.scheduler.reqStatus = 2;
      },
      (error) => {
        console.error(`[scheduler.component]: ${error}`);
        this.scheduler.data = [];
        this.scheduler.reqStatus = 3;
      }
    );
  }

  newScriptChange(element: string, newSelection: any): void {
    switch (element) {
      case 'script':
        this.selectedScript = newSelection;
        break;

      case 'frequency':
        this.selectedFrequency = newSelection;
        break;

      default:
        break;
    }
  }

  createScript(): void {
    if (this.resetNewScriptFields) {
      this.resetNewScriptFields = false;
    }

    this.scriptReqStatus = 1;

    const newScript: ScheduledScript = {
      script_id: this.selectedScript.id,
      frequency: this.selectedFrequency.cronExpression,
    };

    this.scriptsService
      .postAccountScript(this.selectedAccount.id, newScript)
      .subscribe(
        () => {
          // refresh table data
          this.getAccountScripts(this.selectedAccount);
          this.snackService.loadSnackBar(
            'El script fue agregado correctamente',
            'Cerrar'
          );

          this.newScript = false;
          delete this.selectedScript;
          delete this.selectedFrequency;
          this.resetNewScriptFields = true;

          this.scriptReqStatus = 2;
        },
        (error) => {
          console.error(`[scheduler.component]: ${error}`);

          const errorDetails =
            error?.error?.message?.includes('already scheduled') &&
            'Este script ya ha sido agregado.';
          this.scriptReqStatus = 3;

          this.snackService.loadSnackBar(
            errorDetails ? errorDetails : 'Error al agregar script',
            'Cerrar'
          );
        }
      );
  }

  cancelScriptCreation(): void {
    this.newScript = false;

    delete this.selectedScript;
    delete this.selectedFrequency;
    this.resetNewScriptFields = true;
  }

  confirmScriptDeletion(script): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        question: '¿Eliminar script?',
        content: [
          `El script "${script.name}" dejará de correr en la cuenta. ¿Estás seguro de eliminarlo de manera permanente?`,
        ],
      },
    });

    dialogRef.afterClosed().subscribe((modalResp) => {
      // if modal response exists (not undefined) convert modal response to boolean type
      if (!!modalResp) {
        const resp = modalResp === 'true';
        if (resp) {
          this.deleteScript(script);
        }
      }
    });
  }

  deleteScript(item): void {
    this.scriptsService
      .deleteAccountScript(this.selectedAccount.id, item.script_id)
      .subscribe(
        () => {
          // refresh table data
          this.getAccountScripts(this.selectedAccount);
          this.snackService.loadSnackBar(
            'El script fue eliminado correctamente',
            'Cerrar'
          );
        },
        (error) => {
          console.error(`[scheduler.component]: ${error}`);
          this.snackService.loadSnackBar(
            'Error al eliminar script',
            'Reintentar'
          );
        }
      );
  }

  ngOnDestroy(): void {
    if (this.snackService.snackBarRef) {
      this.snackService.dismissSnackBar();
    }
  }
}
