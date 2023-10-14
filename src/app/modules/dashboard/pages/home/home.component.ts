import { Component, OnInit } from '@angular/core';
import { REQ_STATUS } from 'src/app/constants/general';
import { User } from 'src/app/models/user';
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
    private userService: UserService
  ) {
    this.user = this.userService.user;
  }

  ngOnInit(): void {
    this.getCustomers();
  } 

  getCustomers(): void {
    this.customersReqStatus = REQ_STATUS.LOADING;
  }
}
