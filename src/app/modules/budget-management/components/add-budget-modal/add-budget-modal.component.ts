import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DATE_PICKER_FORMAT } from 'src/app/constants/general';
import {
  numberToText,
  UnitDetails,
} from 'src/app/tools/functions/parse-number/parse-number';
import { Provider } from 'src/app/tools/types/global';
import * as moment from 'moment';
import { Providers } from 'src/app/enums/general';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-budget-modal',
  templateUrl: './add-budget-modal.component.html',
  styleUrls: ['./add-budget-modal.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: DATE_PICKER_FORMAT },
  ],
})
export class AddBudgetModalComponent implements OnInit {
  account: Account = new Account();

  valueInText;

  showConfirmation: boolean = false;

  form: FormGroup;
  formBudgetSub: Subscription;

  validConfirmation = {
    numbers: undefined,
    words: undefined,
  };
  constructor(
    public dialogRef: MatDialogRef<AddBudgetModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddBudgetModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.account = this.data.account;

    this.form = this.fb.group({
      budgetName: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      budget: [null, Validators.required],
      budgetConfirmationByNumbers: [null, Validators.required],
      budgetconfirmationByWords: [null, Validators.required],
    });

    if (this.account.provider === Providers.facebook) {
      this.form.controls.budgetName.clearValidators();
      this.form.controls.startDate.clearValidators();
      this.form.controls.endDate.clearValidators();
    }

    this.formBudgetSub = this.form.controls.budget.valueChanges.subscribe(
      () => {
        this.getBudgetInWords();
      }
    );
  }

  getBudgetInWords() {
    const unitDetails: UnitDetails = new UnitDetails();
    this.valueInText = numberToText(
      this.form.controls.budget.value,
      unitDetails
    );
  }

  validateConfirmation(): void {
    if (
      this.form.controls.budget.value ==
      this.form.controls.budgetConfirmationByNumbers.value
    ) {
      this.validConfirmation.numbers = true;
    } else {
      this.validConfirmation.numbers = false;
    }

    if (
      this.form.controls.budgetconfirmationByWords.value
        .toLowerCase()
        .replace(/\s/g, '') == this.valueInText.toLowerCase().replace(/\s/g, '')
    ) {
      this.validConfirmation.words = true;
    } else {
      this.validConfirmation.words = false;
    }

    if (this.validConfirmation.numbers && this.validConfirmation.words) {
      this.emitAccountBudgetData();
    }
  }

  emitAccountBudgetData() {
    const accountBudget: AccountBudget = new AccountBudget();
    accountBudget.budget = this.form.controls.budget.value;

    if (this.account.provider === Providers.adwords) {
      accountBudget.budgetName = this.form.controls.budgetName.value;
      accountBudget.startDate = moment(
        this.form.controls.startDate.value
      ).format('YYYY-MM-DD HH:mm:ss');
      accountBudget.endDate = moment(this.form.controls.endDate.value)
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss');
    }

    this.dialogRef.close(accountBudget);
  }

  ngOnDestroy() {
    this.formBudgetSub?.unsubscribe();
  }
}

export class AddBudgetModal {
  account: Account;
}

class Account {
  id: string;
  name: string;
  clientName: string;
  provider: Provider;
}

export class AccountBudget {
  budget: number;
  budgetName?: string;
  startDate?: string;
  endDate?: string;
}
