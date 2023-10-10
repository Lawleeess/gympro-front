import { Component, OnInit } from '@angular/core';
import { REQ_STATUS } from 'src/app/constants/general';
import { PaginationParams } from 'src/app/models/general';
import { UsersParams } from '../../components/users-list/users-list.component';
import { UsersManagementService } from '../../services/users-management.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  initUsers: any[] = [];
  usersTotal: number = 0;
  usersReqStatus: number = REQ_STATUS.INITIAL;

  constructor(private userManagementService: UsersManagementService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(requestParams?: UsersParams): void {
    this.usersReqStatus = REQ_STATUS.LOADING;

    this.userManagementService
      .getUsers(
        requestParams?.offset,
        requestParams?.limit,
        requestParams?.department,
        requestParams?.filter
      )
      .subscribe(
        (resp: any) => {
          if (resp.totalItems > 0) {
            this.users = [...resp.items];
            this.initUsers = [...this.users];
            this.usersTotal = resp.totalItems;
          } else {
            this.clearUsers();
          }
          this.usersReqStatus = REQ_STATUS.SUCCESS;
        },
        (error) => {
          this.clearUsers();
          this.usersReqStatus = REQ_STATUS.ERROR;
          console.error(error);
        }
      );
  }

  clearUsers(): void {
    this.users = [];
    this.initUsers = [];
    this.usersTotal = 0;
  }
}
