import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { REQ_STATUS } from 'src/app/constants/general';
import { MODULES, MODULES_TYPES, ROLES } from 'src/app/constants/modules';
import { isEmpty } from 'lodash-es';
import { Module } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ModuleData } from '../modules-list/modules-list.component';
import { CustomerTable } from 'src/app/modules/customer-management/pages/customers/customers.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { UsersManagementService } from '../../services/users-management.service';

@Component({
  selector: 'app-tools-list',
  templateUrl: './tools-list.component.html',
  styleUrls: ['./tools-list.component.scss'],
})
export class ToolsListComponent implements OnInit {
  private _user: any;
  @Output() refreshUser = new EventEmitter<boolean>();
  @Output() toolToUpdate = new EventEmitter<Module>();
  @Input() allowActionsTools: boolean = false;
  @Input() status = REQ_STATUS.INITIAL;
  @Input() set user(value: any) {
    this._user = value;

    if (this.user) {
      this.loadInfo();
    }
  }

  get user(): any {
    return this._user;
  }
  customers: CustomerTable = {
    data: [],
    reqStatus: REQ_STATUS.INITIAL,
  };
  preselectedOptions = [];
  tools: ModuleData[];
  initTools: ModuleData[];
  ROLES = { ...ROLES };
  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackService: SnackBarService,
    private usersManagementService: UsersManagementService,
  ) {}
  selectedTool: ModuleData;
  updateReqStatus: number = REQ_STATUS.INITIAL;

  ngOnInit(): void {}
  //getting modules with permissions where the type of them are 'tool' to got displayed on tools list module
  parseUserModules(): ModuleData[] {
    const allowModulesForActiveUser: Module[] =
      this.userService.user.modulesWithPermission.filter(
        (i) => i.role === ROLES.admin.id
      );
    const allowModulesIDForActiveUser: string[] = allowModulesForActiveUser.map(
      (i) => i.name
    );
    const tools: any[] = this.user.modulesWithPermission
      ?.filter((i) => MODULES[i.name]['type'] == MODULES_TYPES.Tool)
      .map((i) => {
        const toolData: ModuleData = {
          name: i.name,
          role: i.role,
          parsedName: MODULES[i.name].name,
          type: MODULES[i.name]['type'],
          parsedRole: ROLES[i.role].name,
          icon: MODULES[i.name].icon,
          editableForActiveUser: allowModulesIDForActiveUser.includes(i.name),
        };
        return toolData;
      });
    return isEmpty(tools) ? [] : [...tools];
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
    this.selectedTool = moduleData;

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
            `Se actualizó el rol a "${ROLES[newRole].name}" para la herramienta de ${moduleData.parsedName}.`,
            'Cerrar'
          );
          this.refreshUser.emit(true);
          delete this.selectedTool;
          this.updateReqStatus = REQ_STATUS.SUCCESS;
        },
        (error) => {
          this.snackService.loadSnackBar(
            `Ocurrió un error al actualizar el rol de la herramienta de ${
              MODULES[module.name].name
            }. Por favor, intente nuevamente.`,
            'Cerrar'
          );

          delete this.selectedTool;
          this.updateReqStatus = REQ_STATUS.ERROR;
          console.error(error);
        }
      );
  }

  //first we parse modules to show with the already clients with permissions
  loadInfo() {
    this.initTools = this.parseUserModules();
    this.tools = [...this.initTools];
  }

  confirmDeletion(module): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        content: [
          `El usuario <strong>${
            this.user.name
              ? `${this.user.name} ${this.user.lastname}`
              : `${this.user.lastname}`
          }</strong> dejará de tener acceso a la herramienta de <strong>${
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
          this.deleteTool(module);
        }
      }
    });
  }

  deleteTool(toolData: ModuleData): void {
    this.updateReqStatus = REQ_STATUS.LOADING;
    const updatedModuleList: Module[] = [...this.user.modulesWithPermission];

    const moduleIndex = updatedModuleList.findIndex(
      (i) => i.name === toolData.name
    );
    
    updatedModuleList.splice(moduleIndex, 1);

    this.usersManagementService
      .updateUserModules(this.user.id, updatedModuleList)
      .subscribe(
        () => {
          this.snackService.loadSnackBar(
            `Se eliminó el acceso al módulo de "${toolData.parsedName}".`,
            'Cerrar'
          );
          this.refreshUser.emit(true);
          delete this.selectedTool;
          this.updateReqStatus = REQ_STATUS.SUCCESS;
        },
        (error) => {
          this.snackService.loadSnackBar(
            `Ocurrió un error al eliminar el módulo de "${toolData.parsedName}" Por favor, intente nuevamente.`,
            'Cerrar'
          );

          delete this.selectedTool;
          this.updateReqStatus = REQ_STATUS.ERROR;
          console.error(error);
        }
      );
  }
}
