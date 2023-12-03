import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { REQ_STATUS } from 'src/app/constants/general';
import { MODULES } from 'src/app/constants/modules';
import { USER_ROLE } from 'src/app/constants/users';
import { PaginationEvent, PaginationParams } from 'src/app/models/general';
import { Roles, User } from 'src/app/models/user';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';
import { getPaginationParams } from 'src/app/tools/functions/general';
import { UsersManagementService } from '../../services/users-management.service';
import { isEmpty } from 'lodash-es';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  // @Input() users
  private _users: User[];
  @Input() set users(value: User[]) {
    this._users = value;
    this.initUsers = this.users;
  }

  get users(): User[] {
    return this._users;
  }

  private _status: number = REQ_STATUS.INITIAL;
  @Input() set status(value: number) {
    this._status = value;

    if (
      value === REQ_STATUS.SUCCESS ||
      (value === REQ_STATUS.LOADING && !isEmpty(this.initUsers))
    ) {
      this.filter.enable();
    } else {
      this.filter.disable();
    }
  }

  get status(): number {
    return this._status;
  }

  @Input() usersTotal: number = 20;
  @Output() refreshUsers = new EventEmitter<UsersParams | void>();

  imagePath: string;

  initUsers: any[];
  roles: Roles[] = [
    { value: 'all', label: 'Todos' },
    ...Object.values(USER_ROLE),
  ];
  selectedDepartment: string = this.roles[0].value;
  filter = new FormControl({ value: null, disabled: true });

  usersParams: UsersParams;

  loggedInUser: User = new User();
  loggedInUserRole: string; // user role for userManagement module

  filterSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private snackService: SnackBarService,
    private usersManagementService: UsersManagementService,
    private userService: UserService,
    private router: Router,
  ) {
    this.loggedInUser = this.userService.user;
    this.loggedInUserRole = this.userService.getUserRole(
      this.userService.user,
      MODULES.userManagement.id
    );
  }

  ngOnInit(): void {
    if (this.status === undefined) {
      this.status = REQ_STATUS.SUCCESS;
    }

    this.filterSub = this.filter.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value: string) => {
          if (value !== null) {
            this.setRequestParams();
          }
          return [];
        })
      )
      .subscribe(() => {});
  }

  applyFilter() {
    this.setRequestParams();
  }
  toAddAdmin(): void{
    this.router.navigate(['/dashboard/register']);
  }

  confirmDeletetion(user): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        content: [
          `El usuario <strong>${
            user.name ? `${user.name} ${user.lastname} ` : ``
          }</strong>con el correo <strong>${
            user.email
          }</strong> será eliminado.`,
          `¿Deseas continuar?`,
        ],
      },
    });

    dialogRef.afterClosed().subscribe((modalResp) => {
      // if modal response exists (not undefined) convert modal response to boolean type
      if (!!modalResp) {
        const resp = modalResp === 'true';
        if (resp) {
          this.deleteUser(user);
        }
      }
    });
  }

  deleteUser(user): void {
    this.usersManagementService.deleteUser(user.id).subscribe(
      () => {
        this.snackService.loadSnackBar(
          `El usuario ${
            user.name ? `${user.name} ${user.lastname} ` : `${user.email}`
          }se eliminó correctamente.`,
          'Cerrar'
        );
        this.refreshUsers.emit();
      },
      (error) => {
        this.snackService.loadSnackBar(
          `Ocurrió un error al eliminar el usuario ${
            user.name ? `${user.name} ${user.lastname} ` : `${user.email}`
          }. Por favor, intente nuevamente.`,
          'Cerrar'
        );
        console.error(error);
      }
    );
  }

  pageChange(event: PaginationEvent): void {
    this.setRequestParams(event);
  }

  setRequestParams(pagination?: PaginationEvent): void {
    if (!!pagination) {
      const pagParams: PaginationParams = getPaginationParams(pagination);
      this.usersParams = { ...pagParams };
    }

    this.usersParams = {
      ...this.usersParams,
      roles:
        !!this.selectedDepartment && this.selectedDepartment !== 'all'
          ? this.selectedDepartment
          : null,
      filter: !!this.filter.value ? this.filter.value : null,
    };

    this.refreshUsers.emit(this.usersParams);
  }

  onDestroy(): void {
    this.filterSub?.unsubscribe();
  }
}

export class UsersParams extends PaginationParams {
  roles?: string;
  filter?: string;
}
