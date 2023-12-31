import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MODULES, ROLES } from 'src/app/constants/modules';
import { ModuleData } from 'src/app/models/general';
import { Module } from 'src/app/models/user';
import { MODULES_TYPES } from '../../../../constants/modules';

@Component({
  selector: 'app-module-form',
  templateUrl: './module-form.component.html',
  styleUrls: ['./module-form.component.scss'],
})
export class ModuleFormComponent implements OnInit {
  private _allowedModules: Module[];
  @Input() set allowedModules(value: Module[]) {
    this._allowedModules = value;
    this.getModuleOptions();
  }
  get allowedModules(): Module[] {
    return this._allowedModules;
  }
  @Input() isLoading: boolean = false;

  @Input() userRole: string;

  @Output() formModuleChange = new EventEmitter<Module>();
  @Output() closeFormModule = new EventEmitter<boolean>();

  modules: ModuleData[];
  ROLES = Object.values({ ...ROLES });

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.getModuleOptions();

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
    });

    console.log("allowedModules form: ",this.allowedModules)
  }

  getModuleOptions(): void {
    let modulesOptions: ModuleData[] = []
    console.log(this.userRole)
    if (this.userRole == "user"){
      modulesOptions.push(MODULES.personalGoals);
      modulesOptions.push(MODULES.routinesCalendar);
    }else if (this.userRole == "admin"){
      modulesOptions.push(MODULES.userManagement);
      modulesOptions.push(MODULES.routinesManagement);
    }

     
    this.modules = modulesOptions;
  }

  formChange(): void {
    const newModule: Module = this.form.value;
    this.formModuleChange.emit(newModule);
  }

  closeForm(): void {
    this.closeFormModule.emit(true);
  }
}
