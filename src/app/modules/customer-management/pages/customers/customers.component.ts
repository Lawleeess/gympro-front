import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { REQ_STATUS } from 'src/app/constants/general';
import { MODULES, ROLES } from 'src/app/constants/modules';
import { Customer } from 'src/app/models/customer';
import { TableColumn } from 'src/app/modules/shared/components/generic-table/generic-table.component';
import { UserService } from 'src/app/services/user.service';
import { CustomerManagementService } from '../../services/customer-management.service';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  customersTableColumns: TableColumn[] = [
    {
      name: 'name',
      title: 'Nombre comercial',
    },
    {
      name: 'url',
      title: 'Sitio web',
      link: true,
    },
    {
      name: 'currency',
      title: 'Moneda',
      textAlign: 'center',
    },
    {
      name: 'status',
      title: 'Estatus',
      status: true,
      textAlign: 'center',
    },
    {
      name: 'edit',
      textAlign: 'center',
      icon: 'fas fa-eye',
    },
  ];

  customers: CustomerTable = {
    data: [],
    reqStatus: REQ_STATUS.INITIAL,
  };

  selectedCustomer: Customer;
  loggedInUserRole: string;

  constructor(
    private customerMgmtService: CustomerManagementService,
    private userService: UserService,
    private router: Router
  ) {
    const editIcon = 'fas fa-edit';

    this.loggedInUserRole = this.userService.getUserRole(
      this.userService.user,
      MODULES.clientManagement.id
    );

    if (this.loggedInUserRole === ROLES.admin.id) {
      this.customersTableColumns[this.customersTableColumns.length - 1].icon =
        editIcon;
    }
  }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    this.customers.reqStatus = REQ_STATUS.LOADING;
    this.customerMgmtService.getCustomers().subscribe(
      (resp: Customer[]) => {
        this.customers.data = resp;
        this.customers.reqStatus = REQ_STATUS.SUCCESS;
      },
      (error) => {
        this.customers.data = [];
        this.customers.reqStatus = REQ_STATUS.ERROR;
      }
    );
  }

  selectCustomer(selection): void {
    const customer = selection.row;
    this.selectedCustomer = customer;
    this.router.navigate(['/dashboard/customers/edit'], {
      queryParams: { id: customer.id },
    });
  }
}
export interface CustomerTable {
  data: Customer[];
  reqStatus: number;
}
