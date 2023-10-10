import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isEmpty } from 'lodash-es';
import { ModuleData } from '../modules-list/modules-list.component';
import { ROLES } from 'src/app/constants/modules';
import { CustomerManagementService } from 'src/app/modules/customer-management/services/customer-management.service';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { REQ_STATUS } from 'src/app/constants/general';
import { Customers } from '../../../../models/user';
@Component({
  selector: 'app-customers-form',
  templateUrl: './customers-form.component.html',
  styleUrls: ['./customers-form.component.scss']
})
export class CustomersFormComponent implements OnInit {
  private _user: any;
  @Output() emittUpdateRequest = new EventEmitter<Boolean>();
  @Output() formModuleChange = new EventEmitter<Customers>();
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
  clients: ModuleData[];
  initClients: ModuleData[];
  ROLES = Object.values({ ...ROLES });
  customers: CustomerTable = {
    data: [],
    reqStatus: REQ_STATUS.INITIAL,
  };
  constructor(
    private customerMgmtService: CustomerManagementService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      clients: [[]],
    });
  }

  form: FormGroup;

  ngOnInit(): void {}
  // When form is valid and save button clicked, then we send the module to be updated to parent in order to send it to firestore
  updateCustomers(): void {
    let selectedClients = [];
    if (!isEmpty(this.form.controls['clients'].value)) {
      selectedClients = this.form.controls['clients'].value.map((i) => {
        {
          return { id: i.id };
        }
      });
    }
    const moduleUpdated: Customers = {
      clients: selectedClients
    };
    this.formModuleChange.emit(moduleUpdated);
    this.emittUpdateRequest.emit(false);
  }
  // function added to easily clear clients with permissions
  clearOpts(): void {
    this.form.controls['clients'].reset();
  }
  // function added to easily select all client to give permissions
  selectAll(): void {
    this.form.controls['clients'].setValue(this.customers.data);
  }
  // function added to hide form when user clicks on cancel button
  closeForm() {
    this.form.controls['clients'].setValue(this.preselectedOptions);
    this.emittUpdateRequest.emit(false);
  }
  // getting all customers to make them an option to be selected when changing clients with permissions
  getCustomers(): void {
    this.customers.reqStatus = REQ_STATUS.LOADING;
    this.customerMgmtService.getCustomers().subscribe(
      (resp: Customer[]) => {
        this.customers.data = resp.map((i) => {
          return { id: i.id, name: i.name };
        });
        this.customers.reqStatus = REQ_STATUS.SUCCESS;
        let selection = this.customers.data.filter((i) =>
          this.preselectedOptions.includes(i.id)
        );
        this.form.controls['clients'].setValue(selection);
      },
      (error) => {
        this.customers.data = [];
        this.customers.reqStatus = REQ_STATUS.ERROR;
        console.error(error);
      }
    );
  }
  // pre-select the clients the user has access to
  preselectedCustomers() {
    if (!isEmpty(this.user.clientsWithPermission)) {
      this.preselectedOptions = this.user.clientsWithPermission.map((i) => {
        return i.id;
      });
    }
  }

  loadInfo() {
    this.preselectedCustomers();
    this.getCustomers();
  }
}

interface Customer {
  name: string;
  id: string;
}

interface CustomerTable {
  data: Customer[];
  reqStatus: number;
}
