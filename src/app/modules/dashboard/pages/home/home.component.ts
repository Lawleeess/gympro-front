import { Component, OnInit } from '@angular/core';
import { REQ_STATUS } from 'src/app/constants/general';
import { User } from 'src/app/models/user';
import { CustomerManagementService } from 'src/app/modules/customer-management/services/customer-management.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: User;
  customers: any[];
  customersReqStatus: number = REQ_STATUS.INITIAL;

  campaigns: any[];
  campaignsReqStatus: number = REQ_STATUS.INITIAL;

  // campaigns: any[] = [
  //   {
  //     id: 1,
  //     name: 'aw_chedraui_branding_see_local-campaign_fds',
  //     provider: 'ads'
  //   },
  // ];

  constructor(
    private customerMgmtService: CustomerManagementService,
    private userService: UserService
  ) {
    this.user = this.userService.user;
  }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    this.customersReqStatus = REQ_STATUS.LOADING;
    this.customerMgmtService.getCustomers().subscribe(
      (customers: any[]) => {
        this.customers = customers.map((i) => {
          const alias = i.name.replaceAll(' ', '').slice(0, 3);
          return { ...i, alias };
        });
        this.customersReqStatus = REQ_STATUS.SUCCESS;
      },
      (error) => {
        this.customers = [];
        this.customersReqStatus = REQ_STATUS.ERROR;
      }
    );
  }
}
