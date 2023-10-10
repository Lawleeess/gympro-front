import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { SignupInfo, UserService } from 'src/app/services/user.service';
import { DEPARTMENTS } from 'src/app/constants/users';
import { Department } from 'src/app/models/user';
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
        Validators.compose([Validators.minLength(3), Validators.required]),
      ],
      validatePassword: [
        '',
        Validators.compose([Validators.minLength(3), Validators.required]),
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
