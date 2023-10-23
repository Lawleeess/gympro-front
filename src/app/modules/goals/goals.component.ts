import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { GoalsInfo, SignupInfo, UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})


export class GoalsComponent implements OnInit {

  form: FormGroup;

  reqStatus = 0;
  showPassword: boolean = false;
  showValidatePassword: boolean = false;
  userID: string;


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackService: SnackBarService
  ) {
  
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      age: ['', Validators.required],
      gender: ['hombre', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      activity: ['', Validators.required],
      goal: ['', Validators.required],
    });
    this.userID = !!window.localStorage.getItem('user_id')
    ? JSON.parse(window.localStorage.getItem('user_id'))
    : null;
  }

  formatDate(): string {
    const date = new DatePipe('en-US').transform(this.form.controls['birthday'].value, 'yyyy-MM-dd')
    return date
  }

  registerGoals(): void {
    this.reqStatus = 1;
    if (this.form.valid) {
      const goals: GoalsInfo = {
        age: this.form.controls['age'].value,
        gender: this.form.controls['gender'].value,
        height: this.form.controls['height'].value,
        weight: this.form.controls['weight'].value,
        activity: this.form.controls['activity'].value,
        goal: this.form.controls['goal'].value,
      };
      this.userService.registerGoals(goals, this.userID).subscribe(
        () => {
          this.reqStatus = 2;
          this.snackService.loadSnackBar(
            'Metas obtenidas con exito',
            null,
            null,
            7000
          );
          // window.location.reload();
        },
        (error) => {
          const errorRef = error?.error?.message ? error.error.message : error;
          const errorMsg = this.parseSignUpError(errorRef);
          this.snackService.loadSnackBar(
            `Error al registrar. ${
              !!errorMsg ? errorMsg : 'Intente más tarde.'
            }`,
            'Cerrar'
          );

          console.error(`[registerGoals.component]: ${errorRef}`);
          this.reqStatus = 3;
        }
      );
    }
  }

  parseSignUpError(error: any): string {
    if (typeof error !== 'string') {
      return;
    }

    const errorStr: string = error.toLowerCase().replace('.', '');
    switch (errorStr) {
      case 'an email already exists':
        return 'Ya existe un usuario registrado con este correo.';

      case 'email address must be part of the epa domain':
        return 'El correo debe de tener el dominio @epa.digital.';

      case 'invalid email address':
        return 'El correo es inválido.';

      default:
        return errorStr;
    }
  }

  selectPartialCheckbox()
{
   console.log(this.form.controls['gender'].value)
   console.log(this.form.controls['age'].value)
   console.log(this.form.controls['activity'].value)
   console.log(this.form.controls['goal'].value)
}
}

