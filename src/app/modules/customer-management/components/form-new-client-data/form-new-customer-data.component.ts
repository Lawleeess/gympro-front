import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  OnChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  CUSTOMER_COUNTRY_CODES,
  CUSTOMER_CURRENCY_CODES,
  CUSTOMER_STATUS,
  CUSTOMER_TIME_ZONES,
} from 'src/app/constants/custumers';
import { urlValidator } from 'src/app/tools/functions/validators/form-validators';

@Component({
  selector: 'app-form-new-customer-data',
  templateUrl: './form-new-customer-data.component.html',
  styleUrls: ['./form-new-customer-data.component.scss'],
})
export class FormNewCustomerDataComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() savedCustomer: any;
  @Input() disabled: boolean;
  @Output() formChange = new EventEmitter<FormGroup>();

  form: FormGroup;
  formSub: Subscription;

  TIMEZONES = CUSTOMER_TIME_ZONES;
  CURRENCIES = CUSTOMER_CURRENCY_CODES;
  COUNTRIES = CUSTOMER_COUNTRY_CODES;
  STATUS = CUSTOMER_STATUS;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      url: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(urlValidator),
        ]),
      ],
      countryCode: ['', Validators.required],
      timezone: ['', Validators.required],
      currency: ['', Validators.required],
      status: [this.STATUS.find((i) => i.id === 'active'), Validators.required],
      legalName: ['', Validators.required],
      taxID: ['', Validators.required],
      fiscalAddress: ['', Validators.required],
      paymentConditions: ['', Validators.required],
      contactName: ['', Validators.required],
      contactPhone: ['', Validators.required],
      contactEmail: [
        '',
        Validators.compose([Validators.email, Validators.required]),
      ],
      targetAuditScore: [
        null,
        Validators.compose([
          Validators.min(1),
          Validators.max(100),
          Validators.required,
        ]),
      ],
    });

    this.formChange.emit(this.form);

    if (this.disabled) {
      this.form.disable();
    }

    this.formSub = this.form.valueChanges
      .pipe(debounceTime(5))
      .subscribe(() => {
        this.form.value.targetAuditScore = this.form.value.targetAuditScore
          ? this.form.value.targetAuditScore
          : 0;
        this.formChange.emit(this.form);
      });
  }

  ngOnChanges(): void {
    if (this.savedCustomer) {
      const selectedCountryCode = this.COUNTRIES.find(
        (i) => i.id === this.savedCustomer.countryCode
      );

      const selectedTimezone = this.TIMEZONES.find(
        (i) => i.id == this.savedCustomer.timezone
      );

      const selectedCurrency = this.CURRENCIES.find(
        (i) => i.id === this.savedCustomer.currency
      );

      this.form.setValue({
        name: this.savedCustomer.name ? this.savedCustomer.name : '',
        url: this.savedCustomer.url ? this.savedCustomer.url : '',
        countryCode: selectedCountryCode ? selectedCountryCode : '',
        timezone: selectedTimezone ? selectedTimezone : '',
        currency: selectedCurrency ? selectedCurrency : '',
        status: this.STATUS.find((i) => i.name === this.savedCustomer.status),
        legalName: this.savedCustomer.billing?.legalName
          ? this.savedCustomer.billing.legalName
          : '',
        taxID: this.savedCustomer.billing?.taxID
          ? this.savedCustomer.billing.taxID
          : '',
        fiscalAddress: this.savedCustomer.billing?.fiscalAddress
          ? this.savedCustomer.billing?.fiscalAddress
          : '',
        paymentConditions: this.savedCustomer.billing?.paymentConditions
          ? this.savedCustomer.billing.paymentConditions
          : '',
        contactName: this.savedCustomer.contactInfo?.name
          ? this.savedCustomer.contactInfo.name
          : '',
        contactPhone: this.savedCustomer.contactInfo?.phoneNumber
          ? this.savedCustomer.contactInfo.phoneNumber
          : '',
        contactEmail: this.savedCustomer.contactInfo?.email
          ? this.savedCustomer.contactInfo.email
          : '',
        targetAuditScore: this.savedCustomer.auditConfiguration.targetAuditScore
          ? this.savedCustomer.auditConfiguration.targetAuditScore
          : '',
      });

      this.disableRequiredValidators();
    }

    if (this.disabled && this.form?.enabled) {
      this.form.disable();
    } else if (!this.disabled && this.form?.disabled) {
      this.form.enable();
    }
  }

  disableRequiredValidators() {
    this.form.controls['url'].setValidators(Validators.pattern(urlValidator));
    this.form.controls['countryCode'].clearValidators();
    this.form.controls['timezone'].clearValidators();
    this.form.controls['currency'].clearValidators();
    this.form.controls['legalName'].clearValidators();
    this.form.controls['taxID'].clearValidators();
    this.form.controls['fiscalAddress'].clearValidators();
    this.form.controls['paymentConditions'].clearValidators();
    this.form.controls['contactName'].clearValidators();
    this.form.controls['contactPhone'].clearValidators();
    this.form.controls['contactEmail'].setValidators(Validators.email);
    this.form.controls['targetAuditScore'].setValidators([
      Validators.min(1),
      Validators.max(100),
    ]);

    this.form.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.formSub?.unsubscribe();
  }
}
