import { Component, Inject, OnInit, Provider } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  numberToText,
  UnitDetails,
} from 'src/app/tools/functions/parse-number/parse-number';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent implements OnInit {
  type: 'budget' | 'fee';
  question: string;
  value: number | string;
  account: Account = new Account();

  valueInText;

  form: FormGroup;
  validConfirmation = {
    numbers: undefined,
    words: undefined,
  };

  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.type = this.data.type;
    this.question = this.data.question;
    this.value = this.data.value.toFixed(2);
    this.account = this.data.account;

    this.form = this.fb.group({
      numbers: [null, Validators.required],
      words: [null, Validators.required],
    });

    const unitDetails: UnitDetails = new UnitDetails();
    if (this.type === 'fee') {
      unitDetails.centConcat = 'punto';
    }
    this.valueInText = numberToText(this.value, unitDetails);
  }

  validateConfirmation(): void {
    if (this.form.controls.numbers.value == this.value) {
      this.validConfirmation.numbers = true;
    } else {
      this.validConfirmation.numbers = false;
    }

    if (
      this.form.controls.words.value.toLowerCase().replace(/\s/g, '') ==
      this.valueInText.toLowerCase().replace(/\s/g, '')
    ) {
      this.validConfirmation.words = true;
    } else {
      this.validConfirmation.words = false;
    }

    if (this.validConfirmation.numbers && this.validConfirmation.words) {
      this.dialogRef.close(true);
    }
  }
}

export class ConfirmationModal {
  type: 'budget' | 'fee';
  question: string;
  value: number;
  account: Account;
}

class Account {
  id: string;
  name: string;
  clientName: string;
  provider: Provider;
}
