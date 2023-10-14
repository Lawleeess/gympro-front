import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { REQ_STATUS } from 'src/app/constants/general';
import { UserInfoService } from '../../services/user-info.service';
import {
  AdwordsAccount,
  AnalyticsAccount,
  Customer,
  FacebookAccount,
} from 'src/app/models/customer';
import { UserService } from 'src/app/services/user.service';
import { MODULES } from 'src/app/constants/modules';
import isEmpty from 'lodash-es/isEmpty';
import { Providers } from 'src/app/enums/general';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.scss'],
})
export class NewCustomerComponent implements OnInit {
  customerID: string;
  customerPostgresID: number;
  customer: Customer;
  accounts: FacebookAccount[] | AdwordsAccount[] | AnalyticsAccount[] = [];
  customerDataForm: FormGroup;
  confirmCreation: boolean;

  getReqStatus: number = REQ_STATUS.INITIAL;
  mgmtReqStatus: number = REQ_STATUS.INITIAL;

  isLinear = true;
  loggedInUserRole: string;
  errorMsg: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerMgmtService: UserInfoService,
    private userService: UserService
  ) {
    this.loggedInUserRole = this.userService.getUserRole(
      this.userService.user,
      MODULES.userInfo.id
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const isEditPage = this.router.url.includes('/edit');

      if (!!params.id && isEditPage) {
        this.customerID = params.id;
        this.getCustomer();
        this.errorMsg && delete this.errorMsg;
      } else if (isEditPage) {
        console.error(
          '[new-customer.component]: not id (customer id) provided as query param in the route'
        );

        this.errorMsg = 'No fue posible encontrar el id del cliente.';
        this.getReqStatus = REQ_STATUS.ERROR;
      }
    });
  }

  getCustomer() {
    this.getReqStatus = REQ_STATUS.LOADING;
    this.customerMgmtService.getCustomer(this.customerID).subscribe(
      (resp: Customer) => {
        this.customer = resp;
        this.customerPostgresID = this.customer.postgresID;
        this.accounts = this.customer.accounts;
        this.getReqStatus = REQ_STATUS.SUCCESS;
      },
      (error) => {
        delete this.customer;
        this.getReqStatus = REQ_STATUS.ERROR;
      }
    );
  }

  stepChange(step) {
    if (step?.previouslySelectedIndex === 0) {
      this.onCustomerDataChange();
    }
    if (step?.selectedIndex === 2) {
      this.customer = { ...this.customer, accounts: this.accounts };
    }
  }

  onCustomerDataFormChange(formGroup: FormGroup) {
    setTimeout(() => {
      this.customerDataForm = formGroup;
    }, 100);
  }

  onCustomerDataChange() {
    const rawCustomer = {
      ...this.customerDataForm.value,
    };
    this.customer = {
      name: rawCustomer.name,
      url: rawCustomer.url,
      countryCode: rawCustomer.countryCode.id,
      timezone: rawCustomer.timezone.id,
      currency: rawCustomer.currency.id,
      status: rawCustomer.status.name,
      billing: {
        legalName: rawCustomer.legalName,
        taxID: rawCustomer.taxID,
        fiscalAddress: rawCustomer.fiscalAddress,
        paymentConditions: rawCustomer.paymentConditions,
      },
      contactInfo: {
        name: rawCustomer.contactName,
        phoneNumber: rawCustomer.contactPhone,
        email: rawCustomer.contactEmail,
      },
      auditConfiguration: {
        targetAuditScore: rawCustomer.targetAuditScore,
        lastVariationAuditScore: {
          date: this.customer?.auditConfiguration?.lastVariationAuditScore
            ?.date,
          score:
            this.customer?.auditConfiguration.lastVariationAuditScore?.score,
        },
      },
      accounts: this.accounts,
    };
  }

  onAccountsChange(
    accounts: (AdwordsAccount | FacebookAccount | AnalyticsAccount)[]
  ) {
    this.accounts = accounts;
    this.customer = { ...this.customer, accounts: this.accounts };
  }

  parseAccounts(accounts): any[] {
    if (!isEmpty(accounts)) {
      for (const i of accounts) {
        i.accountID = i.accountID.toString();
        delete i.auxID;
        delete i.managerName;

        if (i.provider === Providers.adwords && !i.externalLoginCustomerID) {
          i.externalLoginCustomerID = '2465423267';
        }
      }

      return accounts;
    }
    return [];
  }

  saveChanges() {
    this.confirmCreation = true;
    this.mgmtReqStatus = REQ_STATUS.LOADING;
    const parsedAccounts = this.parseAccounts(this.accounts);

    if (!this.customerID) {
      this.createCustomer({
        ...this.customer,
        accounts: parsedAccounts,
      });
    } else {
      this.updateCustomer({
        ...this.customer,
        id: this.customerID,
        postgresID: this.customerPostgresID,
        accounts: parsedAccounts,
      });
    }
  }

  createCustomer(customer: Customer) {
    this.customerMgmtService.createCustomer(customer).subscribe(
      () => {
        this.mgmtReqStatus = REQ_STATUS.SUCCESS;
      },
      (error) => {
        this.mgmtReqStatus = REQ_STATUS.ERROR;
      }
    );
  }

  updateCustomer(customer: Customer) {
    this.customerMgmtService.updateCustomer(customer).subscribe(
      () => {
        this.mgmtReqStatus = REQ_STATUS.SUCCESS;
      },
      (error) => {
        this.mgmtReqStatus = REQ_STATUS.ERROR;
      }
    );
  }
}
