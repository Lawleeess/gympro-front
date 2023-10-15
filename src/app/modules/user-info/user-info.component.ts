import { registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { SignupInfo, UserService } from 'src/app/services/user.service';
import localeEs from '@angular/common/locales/es'
registerLocaleData(localeEs,'es');

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  providers: [{provide: LOCALE_ID, useValue:'es'}]
})
export class UserInfoComponent implements OnInit {

  form: FormGroup;

  reqStatus = 0;
  showPassword: boolean = false;
  showValidatePassword: boolean = false;
  isDisabled: boolean = true;
  imagePath: string;
  userName: string;
  userLastName: string;
  birthday: string;
  phoneNumber: string;
  subscription: string;
  userEmail: string;
  constructor(
    private userService: UserService,
    private router: Router,
    private snackService: SnackBarService
  ) {
  }


  ngOnInit(): void {
    this.setUserValues();
  }

  

  setUserValues():void{
    this.imagePath = !!window.localStorage.getItem('url_image')
    ? JSON.parse(window.localStorage.getItem('url_image'))
    : null;
    this.userName = !!window.localStorage.getItem('user_name')
    ? JSON.parse(window.localStorage.getItem('user_name'))
    : null;
    this.userLastName = !!window.localStorage.getItem('user_lastname')
    ? JSON.parse(window.localStorage.getItem('user_lastname'))
    : null;
    this.userEmail = !!window.localStorage.getItem('user_email')
    ? JSON.parse(window.localStorage.getItem('user_email'))
    : null;
    this.birthday = !!window.localStorage.getItem('birthday')
    ? JSON.parse(window.localStorage.getItem('birthday'))
    : null;
    this.phoneNumber = !!window.localStorage.getItem('phone_number')
    ? JSON.parse(window.localStorage.getItem('phone_number'))
    : null;
    this.subscription = !!window.localStorage.getItem('subscription')
    ? JSON.parse(window.localStorage.getItem('subscription'))
    : null;

    document.getElementById("userName").textContent = this.userName + " " + this.userLastName;
    document.getElementById("userEmail").textContent = this.userEmail;
    document.getElementById("userPhone").textContent = this.phoneNumber;
  }

  signup(): void {
    this.reqStatus = 1;
    if (this.form.valid) {
      const register: SignupInfo = {
        name: this.form.controls['name'].value,
        lastname: this.form.controls['lastname'].value,
        phone_number: this.form.controls['phone_number'].value,
        birthday: this.form.controls['phone_number'].value,
        email: this.form.controls['email'].value,
        password: this.form.controls['password'].value,
      };
      this.userService.signup(register).subscribe(
        () => {
          this.reqStatus = 2;
          this.snackService.loadSnackBar(
            'Registro exitoso. Espera a que un administrador te de acceso a algún módulo.',
            null,
            null,
            7000
          );
          this.router.navigate(['/login']);
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
}
