import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { SignupInfo, UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  form: FormGroup;

  reqStatus = 0;
  showPassword: boolean = false;
  showValidatePassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackService: SnackBarService
  ) {
    if (!!this.userService.user.id) {
      this.userService.logout(false);
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      phone_number: ['', Validators.required],
      birthday: ['', Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[¡!¿?@#$%^&]).{6,}')
        ]),
      ],
      validatePassword: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[¡!¿?@#$%^&]).{6,}')
        ]),
      ],
    });
  }

  formatDate(): string {
    const date = new DatePipe('en-US').transform(this.form.controls['birthday'].value, 'yyyy-MM-dd')
    return date
  }

  signup(): void {
    this.reqStatus = 1;
    if (this.form.valid) {
      const register: SignupInfo = {
        name: this.form.controls['name'].value,
        lastname: this.form.controls['lastname'].value,
        phone_number: this.form.controls['phone_number'].value,
        birthday: this.formatDate(),
        email: this.form.controls['email'].value,
        password: this.form.controls['password'].value,
      };
      this.userService.signup(register).subscribe(
        () => {
          this.reqStatus = 2;
          this.snackService.loadSnackBar(
            'Se ha enviado un email al correo ingresado. Sigue los pasos para continuar con tu registro.',
            null,
            null,
            7000
          );
          this.router.navigate(
            ['/auth/verify'],
            { queryParams: { email: register.email} }
          );
        },
        (error) => {
          const errorRef = error.error.Message
          const errorMsg = this.parseSignUpError(errorRef);
          this.snackService.loadSnackBar(
            `Error al registrar. ${
              !!errorMsg ? errorMsg : 'Intente más tarde.'
            }`,
            'Cerrar'
          );

          console.error(`[signup.component]: ${errorRef}`);
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
    console.log("errorStr", errorStr)
    switch (errorStr) {
      case 'an email already exists':
        return 'Ya existe un usuario registrado con este correo.';

      case 'email_exists':
        return 'Existe un usuario registrado con este email.';
      
      case 'invalid email address':
        return 'El correo es inválido.';

      default:
        return errorStr;
    }
  }
}
