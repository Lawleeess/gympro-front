import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { REQ_STATUS } from 'src/app/constants/general';
import { MODULES, MODULES_TYPES, ROLES } from 'src/app/constants/modules';
import { Module, User } from 'src/app/models/user';
import { ModalComponent } from 'src/app/modules/shared/components/modal/modal.component';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { UsersManagementService } from '../../services/users-management.service';
import { isEmpty } from 'lodash-es';
import { UserService } from 'src/app/services/user.service';
import { Customers } from '../../../../models/user';
import * as moment from 'moment';
import localeEs from '@angular/common/locales/es'
import { formatDate, registerLocaleData } from '@angular/common';
registerLocaleData(localeEs,'es');

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  providers: [{provide: LOCALE_ID, useValue:'es'}],
})
export class UserDetailsComponent implements OnInit {
  userID: string;
  user: User = {
    id: '',
    name: '',
    lastname: '',
    email: '',
    phone_number: '',
    birthday: '',
    subscription: '',
    url_image: '',
    user_role: '',
    password: ''
  };
  userReqStatus: number = REQ_STATUS.INITIAL;
  updateReqStatus: number = REQ_STATUS.INITIAL;
  deleteReqStatus: number = REQ_STATUS.INITIAL;

  modulesToAdd: Module[];
  toolsToAdd: Module[];
  showNewModuleForm: boolean = false;
  showEditUser: boolean = false;
  showNewToolForm: boolean = false;
  errorMsg: string;
  toolUpdating: Module;
  toolModuleVisible: boolean = false;
  loggedInUser: User = new User();
  loggedInUserRole: string;
  difDate: number;
  currentDate: string;
  clientsModuleVisible: boolean = false;
  flagNoSubscriber : boolean = false;
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackService: SnackBarService,
    private router: Router,
    private usersManagementService: UsersManagementService,
    private userService: UserService
  ) {
    this.loggedInUser = this.userService.user;
    this.loggedInUserRole = this.userService.getUserRole(
      this.userService.user,
      MODULES.userManagement.id
    );
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'es');
  }

  ngOnInit(): void {
    
    this.route.queryParams.subscribe((params) => {
      if (!!params.id) {
        this.userID = params.id;
        this.getUser();
        this.errorMsg && delete this.errorMsg;
      } else {
        console.error(
          '[user-details.component]: not user id provided as query param in the route'
        );
        this.errorMsg = 'No fue posible encontrar el id del usuario.';
      }
    });

  }

  getUser() {
    this.userReqStatus = REQ_STATUS.LOADING;

    this.usersManagementService.getUser(this.userID).subscribe(
      (resp: User) => {
        this.user = resp;
  
        this.difDate =  moment(new Date(this.user.subscription)).diff(moment(new Date(this.currentDate)), 'days');
        if (Number.isNaN(this.difDate)){
          this.flagNoSubscriber = true
        }
        console.log("modulesWp",this.user.modulesWithPermission)
        this.modulesToAdd = this.getEnableModulesToAdd(
          this.user.modulesWithPermission
        );
        console.log("modulesToAdd", this.modulesToAdd)
        this.userReqStatus = REQ_STATUS.SUCCESS;

        if (this.user.modulesWithPermission != null){
          const moduleNames = this.user.modulesWithPermission.map((i) => {
            return MODULES[i.name].id;
          });
          const mappedTools = Object.values(MODULES).filter(
            (i) => i.type == MODULES_TYPES.Tool && !moduleNames.includes(i.id)
          );
          if (
            isEmpty(
              this.user.modulesWithPermission.filter(
                (i) => MODULES[i.name]['type'] == MODULES_TYPES.Tool
              )
            ) &&
            this.loggedInUserRole == ROLES.admin.id
          ) {
            this.toolsToAdd = mappedTools.map((i) => {
              return { name: i.id, role: ROLES.admin.id };
            });
          }
          this.showNewToolForm = !isEmpty(mappedTools);
        }
        
        

      },
      (error) => {
        delete this.user;
        this.userReqStatus = REQ_STATUS.ERROR;
        console.error(error);
      }
    );
  }
  getEnableModulesToAdd(allModulesForUser: Module[]): Module[] {
    const allModulesForAdmin: Module[] =
      this.userService.user.modulesWithPermission.filter(
        (i) => i.role === ROLES.admin.id
      );
    if (isEmpty(allModulesForUser)) {
      return allModulesForAdmin;
    }
    const allAllowedModules = allModulesForAdmin.filter(
      ({ name: id1 }) => !allModulesForUser.some(({ name: id2 }) => id2 === id1)
    );
    console.log("allowedModules", allAllowedModules)
    return allAllowedModules;
  }
  // function to display or hide the tool form module, received from tools list module
  emittUpdateRequest(request: boolean) {
    this.clientsModuleVisible = request;
  }
  updateTool(module: Module) {
    this.toolUpdating = module;
  }
  addNewModule(module: Module): void {
    this.updateReqStatus = REQ_STATUS.LOADING;
    this.userReqStatus = REQ_STATUS.LOADING;
    const savedModules: Module[] = isEmpty(this.user.modulesWithPermission)
      ? []
      : [...this.user.modulesWithPermission];
    let updatedModuleList: Module[] = [];
    let actionMessage: string;
    // We check if the module provided is actually added on the user modules, if it exists then we modify it assigning the new module roles and clients, if it doesnt exists then we append to the user modules
    if (!isEmpty(savedModules.filter((i) => i.name == module.name))) {
      savedModules.forEach(function (e) {
        if (e.name == module.name) {
          (e.role = module.role), (e.clients = module.clients);
          actionMessage = 'modificó';
        }
      });
      updatedModuleList = savedModules;
    } else {
      updatedModuleList = [...savedModules, module];
      actionMessage = 'agregó';
    }

    this.user.modulesWithPermission = updatedModuleList

    this.usersManagementService
      .updateUserData(this.user, this.userID)
      .subscribe(
        () => {
          this.snackService.loadSnackBar(
            `Se ${actionMessage} el módulo de ${
              MODULES[module.name].name
            } correctamente.`,
            'Cerrar'
          );
          this.showNewModuleForm = false;
          this.updateReqStatus = REQ_STATUS.SUCCESS;
          this.userReqStatus = REQ_STATUS.SUCCESS;
          this.getUser();
        },
        (error) => {
          this.snackService.loadSnackBar(
            `Ocurrió un error al dar acceso al módulo de ${
              MODULES[module.name].name
            }. Por favor, intente nuevamente.`,
            'Cerrar'
          );
          this.updateReqStatus = REQ_STATUS.ERROR;
          this.userReqStatus = REQ_STATUS.ERROR;
          console.error(error);
        }
      );
  }

  addNewCustomers(customer: Customers): void {
    this.userReqStatus = REQ_STATUS.LOADING;

    this.usersManagementService
      .updateClientWithPermissions(this.userID, customer)
      .subscribe(
        () => {
          this.snackService.loadSnackBar(
            `Se agregaron
            correctamente los clientes.`,
            'Cerrar'
          );
          this.showNewModuleForm = false;
          this.userReqStatus = REQ_STATUS.SUCCESS;
          this.getUser();
        },
        (error) => {
          this.userReqStatus = REQ_STATUS.ERROR;
          this.snackService.loadSnackBar(
            `Ocurrió un error al añadir clientes. Por favor, intente nuevamente.`,
            'Cerrar'
          );
          console.error(error);
        }
      );
  }

  editUser(userEdit: User): void {

    userEdit.email = this.user.email;
    userEdit.modulesWithPermission = this.user.modulesWithPermission;
    userEdit.birthday = this.user.birthday;
    userEdit.url_image = this.user.url_image;
    userEdit.user_role = this.user.user_role;
    userEdit.userProgress = this.user.userProgress;
    userEdit.userGoals = this.user.userGoals;
    userEdit.userRoutine = this.user.userRoutine;

    this.usersManagementService
      .updateUserData(userEdit, this.userID)
      .subscribe(
        () => {
          this.snackService.loadSnackBar(
            `Se actualizó
            correctamente el usuario.`          );
          this.showEditUser = false;
          this.userReqStatus = REQ_STATUS.SUCCESS;
          this.getUser()
          this.difDate =  moment(new Date(this.user.subscription)).diff(moment(new Date(this.currentDate)), 'days');
          if (Number.isNaN(this.difDate)){
            this.flagNoSubscriber = true
          }else {
            this.flagNoSubscriber = false
          }
        },
        (error) => {
          this.userReqStatus = REQ_STATUS.ERROR;
          this.snackService.loadSnackBar(
            `Ocurrió un error al actualizar el usuario. Por favor, intente nuevamente.`,
            'Cerrar'
          );
          console.error(error);
        }
      );

  }

  confirmUserDeletetion(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        content: [
          `El usuario <strong>${this.user.name} ${this.user.lastname}</strong> con el correo <strong>${this.user.email}</strong> será eliminado.`,
          `¿Deseas continuar?`,
        ],
      },
    });

    dialogRef.afterClosed().subscribe((modalResp) => {
      // if modal response exists (not undefined) convert modal response to boolean type
      if (!!modalResp) {
        const resp = modalResp === 'true';
        if (resp) {
          this.deleteUser();
        }
      }
    });
  }

  deleteUser(): void {
    this.deleteReqStatus = REQ_STATUS.LOADING;
    this.usersManagementService.deleteUser(this.user.id).subscribe(
      () => {
        this.snackService.loadSnackBar(
          `El usuario ${
            this.user.name
              ? `${this.user.name} ${this.user.lastname} `
              : `${this.user.email}`
          }se eliminó correctamente.`,
          'Cerrar'
        );
        this.deleteReqStatus = REQ_STATUS.SUCCESS;
        this.router.navigate(['/dashboard/users']);
      },
      (error) => {
        this.snackService.loadSnackBar(
          `Ocurrió un error al eliminar el usuario ${
            this.user.name
              ? `${this.user.name} ${this.user.lastname} `
              : `${this.user.email}`
          }. Por favor, intente nuevamente.`,
          'Cerrar'
        );
        this.deleteReqStatus = REQ_STATUS.ERROR;
        console.error(error);
      }
    );
  }
}
