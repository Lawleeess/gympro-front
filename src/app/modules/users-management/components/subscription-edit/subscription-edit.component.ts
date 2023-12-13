import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { User } from 'src/app/models/user';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-subscription-edit',
  templateUrl: './subscription-edit.component.html',
  styleUrls: ['./subscription-edit.component.scss']
})
export class SubscriptionEditComponent implements OnInit {

  @Input() isLoading: boolean = false;
  @Input() user: User;
  form: FormGroup;

  @Output() formModuleChange = new EventEmitter<User>();
  @Output() closeFormModule = new EventEmitter<boolean>();

  isDisable: boolean = true;
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
      subscription: ['', Validators.required],
      
    });

   
    // this.form.controls['subscription'].disable();

    this.form.setValue({
      subscription: this.isNull(),
   });
  }

  updateSub(mes: number):void{
    console.log(this.user.subscription)

    // Creas la fecha
    var fecha = new Date(this.user.subscription);

    // Añades los meses
    fecha.setMonth(fecha.getMonth() + mes);

    this.form.setValue({
      subscription: formatDate(fecha, 'yyyy-MM-dd', 'en'),
   });

    console.log(formatDate(fecha, 'yyyy-MM-dd', 'en'))
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
