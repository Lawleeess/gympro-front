import { Component, Input, OnInit } from '@angular/core';
import { CUSTOMER_PROVIDERS } from 'src/app/constants/custumers';
import {
  AdwordsAccount,
  AnalyticsAccount,
  BingAccount,
  Customer,
  FacebookAccount,
  GA4Account,
  TikTokAccount,
  LinkedinAccount,
} from 'src/app/models/customer';
import isEmpty from 'lodash-es/isEmpty';

@Component({
  selector: 'app-customer-review',
  templateUrl: './customer-review.component.html',
  styleUrls: ['./customer-review.component.scss'],
})
export class CustomerReviewComponent implements OnInit {
  @Input() customer: Customer;

  accountsAd: AdwordsAccount[];
  accountsGa: AnalyticsAccount[];
  accountsFb: FacebookAccount[];
  accountsBg: BingAccount[];
  accountsTt: TikTokAccount[];
  accountsGA4: GA4Account[];
  accountsLin: LinkedinAccount[];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.accountsAd = [];
    this.accountsGa = [];
    this.accountsFb = [];
    this.accountsBg = [];
    this.accountsTt = [];
    this.accountsGA4 = [];
    this.accountsLin = [];

    if (!isEmpty(this.customer) && !isEmpty(this.customer.accounts)) {
      this.accountsAd = this.customer.accounts.filter(
        (i) => i.provider === CUSTOMER_PROVIDERS.ad.name
      );
      this.accountsGa = this.customer.accounts.filter(
        (i) => i.provider === CUSTOMER_PROVIDERS.ga.name
      );
      this.accountsFb = this.customer.accounts.filter(
        (i) => i.provider === CUSTOMER_PROVIDERS.fb.name
      );
      this.accountsBg = this.customer.accounts.filter(
        (i) => i.provider === CUSTOMER_PROVIDERS.bg.name
      );
      this.accountsTt = this.customer.accounts.filter(
        (i) => i.provider === CUSTOMER_PROVIDERS.tt.name
      );
      this.accountsGA4 = this.customer.accounts.filter(
        (i) => i.provider === CUSTOMER_PROVIDERS.ga4.name
      );
      this.accountsLin = this.customer.accounts.filter(
        (i) => i.provider === CUSTOMER_PROVIDERS.lin.name
      );
    }
  }
}
