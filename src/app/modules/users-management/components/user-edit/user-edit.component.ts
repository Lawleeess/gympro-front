import {formatDate} from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { SignupInfo, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
 
  @Input() isLoading: boolean = false;
  @Input() user: User;
  form: FormGroup;

  @Output() formModuleChange = new EventEmitter<User>();
  @Output() closeFormModule = new EventEmitter<boolean>();

  reqStatus = 0;
  showPassword: boolean = false;
  showValidatePassword: boolean = false;
  currentDate: string;
  name: string;
  lastname: string;
  phoneNumber: string;
  subscription: string;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackService: SnackBarService,
  ) {
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en')
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      phone_number: ['', Validators.required],
      subscription: ['', Validators.required],
    });

   

    this.form.setValue({
      name: this.user.name,
      lastname: this.user.lastname,
      phone_number: this.user.phone_number,
      subscription: this.isNull(),
   });
  }

  isNull(): string{
    if (this.user.subscription == "" || this.user.subscription === undefined){
      this.user.subscription = formatDate(new Date(), 'yyyy-MM-dd', 'en')
    }
    console.log(this.user.subscription)

    return this.user.subscription
  }

  formChange(): void {
    const updateUser: User = this.form.value;
    this.formModuleChange.emit(updateUser);
  }

  closeForm(): void {
    this.closeFormModule.emit(true);
  }

}
