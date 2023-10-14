import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isEmpty } from 'lodash-es';
import { ModuleData } from '../modules-list/modules-list.component';
import { MODULES, MODULES_TYPES, ROLES } from 'src/app/constants/modules';
import { UserInfoService } from 'src/app/modules/user-info/services/user-info.service';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { REQ_STATUS } from 'src/app/constants/general';
import { Module } from 'src/app/models/user';
@Component({
  selector: 'app-tools-form',
  templateUrl: './tools-form.component.html',
  styleUrls: ['./tools-form.component.scss'],
})
export class ToolsFormComponent implements OnInit {
  private _user: any;
  private _allowedTools: Module[];
  private _clientsRole: string;
  updatingTool;
  isClientEnabled: boolean = false;
  @Input() set allowedTools(value: Module[]) {
    this._allowedTools = value;
  }
  @Output() emittUpdateRequest = new EventEmitter<Boolean>();
  @Output() formModuleChange = new EventEmitter<Module>();
  @Output() closeFormTool = new EventEmitter<boolean>();
  @Input() set user(value: any) {
    this._user = value;

    if (this.user) {
      this.loadInfo();
    }
  }
  @Input() set clientsRole(value: any) {
    this._clientsRole = value;

    if (this._clientsRole == ROLES.admin.id) {
      this.isClientEnabled = true;
    }
  }
  @Input() set toolToUpdate(tool: Module) {
    this.updatingTool = tool;
  }
  get clientsRole(): any {
    return this._user;
  }
  get user(): any {
    return this._user;
  }
  preselectedOptions = [];
  tools: ModuleData[];
  initTools: ModuleData[];
  ROLES = Object.values({ ...ROLES });
  customers: CustomerTable = {
    data: [],
    reqStatus: REQ_STATUS.INITIAL,
  };
  constructor(
    private customerMgmtService: UserInfoService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      clients: [[]],
    });
  }

  form: FormGroup;

  ngOnInit(): void {}
  // When form is valid and save button clicked, then we send the module to be updated to parent in order to send it to firestore
  updateTool(): void {
    const moduleUpdated: Module = {
      name: this.form.controls['name'].value,
      role: this.form.controls['role'].value,
    };
    this.formModuleChange.emit(moduleUpdated);
    this.emittUpdateRequest.emit(false);
    this.closeFormTool.emit(true);
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
    this.closeFormTool.emit(true);
  }

  // parsing the user modules where module type is tool to enable change
  parseUserModules(): ModuleData[] {
    const allowModulesForActiveUser: Module[] =
      this.userService.user.modulesWithPermission.filter(
        (i) => i.role === ROLES.admin.id
      );

    const allowModulesIDForActiveUser: string[] = allowModulesForActiveUser.map(
      (i) => i.name
    );
    if (!isEmpty(this.user.clientsWithPermission)) {
      this.preselectedOptions = this.user.clientsWithPermission.map((i) => {
        return i.id;
      });
    }
    //since tools are all avaible for admin users we can enable them to be displayed as viewer for userManagement admins
    const tools: any[] = Object.values(MODULES)
      .filter((i) => i.type == MODULES_TYPES.Tool)
      .map((i) => {
        return {
          name: i.id,
          role: 'viewer',
          parsedName: MODULES[i.id].name,
          type: MODULES[i.id]['type'],
          parsedRole: ROLES['viewer'].name,
          icon: MODULES[i.id].icon,
          editableForActiveUser: allowModulesIDForActiveUser.includes(i.id),
        };
      });
    return isEmpty(tools) ? [] : [...tools];
  }

  loadInfo() {
    this.initTools = this.parseUserModules();
    this.tools = [...this.initTools];
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
