import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isEmpty } from 'lodash-es';
import { REQ_STATUS } from 'src/app/constants/general';
import { Customer } from 'src/app/models/customer';
import { CustomerTable } from 'src/app/modules/user-info/pages/customers/customers.component';
import { UserInfoService } from 'src/app/modules/user-info/services/user-info.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {
  private _user: any;
  @Input() status = REQ_STATUS.INITIAL;
  @Output() emittUpdateRequest = new EventEmitter<Boolean>();
  @Input() allowActions: boolean = false;
  @Input() set user(value: any) {
    this._user = value;

    if (this.user) {
      this.loadInfo();
    }
  }
  get user(): any {
    return this._user;
  }
  preselectedOptions = [];
  customers: CustomerTable = {
    data: [],
    reqStatus: REQ_STATUS.INITIAL,
  };


  constructor(
    private customerMgmtService: UserInfoService,
    ) { }

  ngOnInit(): void {}

  //emitt the customers form hide/show request update to parent component
  requestUpdate() {
    this.emittUpdateRequest.emit(true);
  }

  //first we parse modules to show with the already clients with permissions
  loadInfo() {
    this.getClientsWithPermission();
    this.getCustomers();
  }


  getClientsWithPermission(): void{
    if (!isEmpty(this.user.clientsWithPermission)) {
      this.preselectedOptions = this.user.clientsWithPermission.map((i) => {
        return i.id;
      });
    } else {
      this.preselectedOptions = [];
    }
  }

  getCustomers(): void {
    this.customers.reqStatus = REQ_STATUS.LOADING;
    this.customerMgmtService.getCustomers().subscribe(
      (resp: Customer[]) => {
        this.customers.data = resp;
        this.customers.reqStatus = REQ_STATUS.SUCCESS;
        let selection = this.customers.data
          .filter((i) => this.preselectedOptions.includes(i.id))
          .map((i) => {
            return i.name;
          });
        this.preselectedOptions = selection;
      },
      (error) => {
        this.customers.data = [];
        this.customers.reqStatus = REQ_STATUS.ERROR;
        console.error(error);
      }
    );
  }
}
