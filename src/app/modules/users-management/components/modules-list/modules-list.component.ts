import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { REQ_STATUS } from 'src/app/constants/general';
import { MODULES, MODULES_TYPES, ROLES } from 'src/app/constants/modules';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { isEmpty } from 'lodash-es';
import { Module, User } from 'src/app/models/user';
import { UsersManagementService } from '../../services/users-management.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modules-list',
  templateUrl: './modules-list.component.html',
  styleUrls: ['./modules-list.component.scss'],
})
export class ModulesListComponent implements OnInit {
  private _user: User;

  @Input() set user(value: User) {
    this._user = value;

    // clear filter
    this.filter = '';

    if (this.user) {
      this.initModules = this.parseUserModules();
      this.modules = [...this.initModules];
    }
  }

  get user(): User {
    return this._user;
  }
  @Input() status = REQ_STATUS.INITIAL;
  @Input() disableActions: boolean = false;
  @Input() allowActions: boolean = false;
  @Output() refreshUser = new EventEmitter<boolean>();

  userID: string;
  errorMsg: string;

  modules: ModuleData[];
  initModules: ModuleData[];
  ROLES = { ...ROLES };

  selectedModule: ModuleData;
  updateReqStatus: number = REQ_STATUS.INITIAL;

  filter: string;

  constructor(
    private dialog: MatDialog,
    private snackService: SnackBarService,
    private usersManagementService: UsersManagementService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (!!params.id) {
        this.userID = params.id;
        this.errorMsg && delete this.errorMsg;
      } else {
        console.error(
          '[user-details.component]: not user id provided as query param in the route'
        );
        this.errorMsg = 'No fue posible encontrar el id del usuario.';
      }
    });
  }

  parseUserModules(): ModuleData[] {
    const allowModulesForActiveUser: Module[] =
      this.userService.user.modulesWithPermission.filter(
        (i) => i.role === ROLES.admin.id
      );

    const allowModulesIDForActiveUser: string[] = allowModulesForActiveUser.map(
      (i) => i.name
    );
    let modules: any[];
    if (!isEmpty(this.user.modulesWithPermission)) {
      modules = this.user.modulesWithPermission
        ?.filter((i) => MODULES[i.name]['type'] == MODULES_TYPES.Module)
        .map((i) => {
          if (MODULES[i.name]['type'] == MODULES_TYPES.Module) {
            const moduleData: ModuleData = {
              name: i.name,
              role: i.role,
              parsedName: MODULES[i.name].name,
              type: MODULES[i.name]['type'],
              parsedRole: ROLES[i.role].name,
              icon: MODULES[i.name].icon,
              editableForActiveUser: true,
            };
            return moduleData;
          }
        });
    }
    return isEmpty(modules) ? [] : [...modules];
  }

  applyFilter() {
    this.modules = this.initModules.filter((i) => {
      if (!!this.filter) {
        return (
          i.name.toLowerCase().includes(this.filter.toLowerCase()) ||
          i.role.includes(this.filter.toLowerCase())
        );
      }
      return true;
    });
  }

  confirmRoleUpdate(module): void {
    const newRole =
      module.role === ROLES.admin.id ? ROLES.viewer.id : ROLES.admin.id;
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        content: [
          `El usuario <strong>${
            this.user.name
              ? `${this.user.name} ${this.user.lastname}`
              : `${this.user.lastname}`
          }</strong> tendrá acceso al módulo de <strong>${
            module.parsedName
          }</strong> con el rol de <strong>${ROLES[newRole].name}</strong>`,
          `¿Deseas continuar?`,
        ],
      },
    });

    dialogRef.afterClosed().subscribe((modalResp) => {
      // if modal response exists (not undefined) convert modal response to boolean type
      if (!!modalResp) {
        const resp = modalResp === 'true';
        if (resp) {
          this.updateRole(module, newRole);
        }
      }
    });
  }

  updateRole(moduleData: ModuleData, newRole: string): void {
    this.updateReqStatus = REQ_STATUS.LOADING;
    this.selectedModule = moduleData;

    const updatedModuleList: Module[] = [...this.user.modulesWithPermission];

    const module: Module = updatedModuleList.find(
      (i) => i.name === moduleData.name
    );
    module.role = newRole;

    this.usersManagementService
      .updateUserModules(this.user.id, updatedModuleList)
      .subscribe(
        () => {
          this.snackService.loadSnackBar(
            `Se actualizó el rol a "${ROLES[newRole].name}" para el módulo de ${moduleData.parsedName}.`,
            'Cerrar'
          );
          this.refreshUser.emit(true);
          delete this.selectedModule;
          this.updateReqStatus = REQ_STATUS.SUCCESS;
        },
        (error) => {
          this.snackService.loadSnackBar(
            `Ocurrió un error al actualizar el rol del módulo de ${
              MODULES[module.name].name
            }. Por favor, intente nuevamente.`,
            'Cerrar'
          );

          delete this.selectedModule;
          this.updateReqStatus = REQ_STATUS.ERROR;
          console.error(error);
        }
      );
  }

  confirmDeletetion(module): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        content: [
          `El usuario <strong>${
            this.user.name
              ? `${this.user.name} ${this.user.lastname}`
              : `${this.user.lastname}`
          }</strong> dejará de tener acceso al módulo de <strong>${
            module.parsedName
          }</strong>`,
          `¿Deseas continuar?`,
        ],
      },
    });

    dialogRef.afterClosed().subscribe((modalResp) => {
      // if modal response exists (not undefined) convert modal response to boolean type
      if (!!modalResp) {
        const resp = modalResp === 'true';
        if (resp) {
          this.deleteModule(module);
        }
      }
    });
  }

  deleteModule(moduleData: ModuleData): void {
    this.updateReqStatus = REQ_STATUS.LOADING;
    const updatedModuleList: Module[] = [...this.user.modulesWithPermission];

    const moduleIndex = updatedModuleList.findIndex(
      (i) => i.name === moduleData.name
    );
    updatedModuleList.splice(moduleIndex, 1);

    this.user.modulesWithPermission = updatedModuleList;

    this.usersManagementService
      .updateUserData(this.user, this.userID)
      .subscribe(
        () => {
          this.snackService.loadSnackBar(
            `Se eliminó el acceso al módulo de "${moduleData.parsedName}".`,
            'Cerrar'
          );
          this.refreshUser.emit(true);
          delete this.selectedModule;
          this.updateReqStatus = REQ_STATUS.SUCCESS;
        },
        (error) => {
          this.snackService.loadSnackBar(
            `Ocurrió un error al eliminar el módulo de "${moduleData.parsedName}" Por favor, intente nuevamente.`,
            'Cerrar'
          );

          delete this.selectedModule;
          this.updateReqStatus = REQ_STATUS.ERROR;
          console.error(error);
        }
      );
  }
}

export class ModuleData extends Module {
  parsedName: string;
  parsedRole: string;
  type: string;
  icon: string;
  editableForActiveUser: boolean;
}
