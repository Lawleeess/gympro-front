import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SCRIPTS } from 'src/app/constants/scripts';
import { Account } from 'src/app/models/account';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { ScriptsService } from '../../services/scripts.service';

@Component({
  selector: 'app-execute',
  templateUrl: './execute.component.html',
  styleUrls: ['./execute.component.scss']
})
export class ExecuteComponent implements OnInit {

  accountList: Account[];
  categoryList: string[] = [];
  scriptList: any[] = [];

  selectedAccount: Account;
  selectedCategory: string;
  selectedScript: any;

  accountsReqStatus: number = 2;
  categoriesReqStatus: number = 2;
  executeReqStatus: number = 0;

  resetSelectedScript: boolean;

  constructor(
    private scriptsService: ScriptsService,
    private snackService: SnackBarService,
    private router: Router
  ) { }

  async ngOnInit() {

    this.accountList = this.scriptsService.accounts
      ? this.scriptsService.accounts
      : await this.getAccounts();

    this.categoryList = this.scriptsService.categories
      ? this.scriptsService.categories
      : await this.getCategories();
  }

  getAccounts() {
    this.accountsReqStatus = 1;
    return this.scriptsService.getAccounts()
      .toPromise()
      .then((accounts: Account[]) => {
        this.scriptsService.accounts = accounts;
        this.accountsReqStatus = 2;
        return accounts;
      })
      .catch(error => {
        console.error(`[execute.component]: ${error}`);
        this.accountsReqStatus = 3;
        return null;
      });
  }

  getCategories() {
    this.categoriesReqStatus = 1;
    return this.scriptsService.getCategories()
      .toPromise()
      .then(
        (categories: string[]) => {
          this.scriptsService.categories = categories;
          this.categoriesReqStatus = 2;
          return categories;
        })
      .catch(error => {
        console.error(`[execute.component]: ${error}`);
        this.categoriesReqStatus = 3;
        return null;
      });
  }

  selectionChange(element: string, newSelection: any) {
    this.resetSelectedScript = false;

    switch (element) {
      case 'account':
        this.selectedAccount = newSelection;
        break;

      case 'category':
        delete this.selectedScript;

        this.selectedCategory = newSelection;
        this.scriptList = SCRIPTS.filter(script => script.category === newSelection);
        this.resetSelectedScript = true;
        break;

      case 'script':
        this.selectedScript = newSelection;
        break;

      default:
        break;
    }
  }

  executeScript() {
    this.executeReqStatus = 1;

    const script = { account_id: this.selectedAccount.id }
    this.scriptsService.postExcecuteScript(this.selectedScript.id, script).subscribe(
      () => {
        this.executeReqStatus = 2;
        this.snackService.loadSnackBar('El script fue ejecutado correctamente', 'Cerrar');
        this.router.navigate(['/scripting-tool/historical']);
      },
      (async (error) => {
        console.error(`[execute.component]: ${error}`);
        this.executeReqStatus = 3;

        const snackBarResp = await this.snackService.loadSnackBar('Error al ejecutar script', 'Cerrar');
        snackBarResp && this.executeScript();
      })
    );
  }

}
