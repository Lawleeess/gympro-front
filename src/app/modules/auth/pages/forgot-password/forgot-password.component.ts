import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { ForgottPasword, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  reqStatus = 0;

  constructor(
    private fb: FormBuilder,    
    private router: Router,
    private snackService: SnackBarService,
    private userService: UserService,
  ) {
    if (!!this.userService.user.id) {
      this.userService.logout(false);
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
    });
  }

  recover(){
    this.reqStatus = 1;
    if (this.form.valid) {
      const recovery: ForgottPasword = {
        email: this.form.controls['email'].value,
        requestType: "PASSWORD_RESET"
      };
      this.userService.forgotPassword(recovery).subscribe(
        () => {
          this.reqStatus = 2;
          this.snackService.loadSnackBar(
            `Comprueba si recibiste un correo electrónico. Enviamos el correo a: ${recovery.email}`,
            null,
            null,
            7000
          );
          this.router.navigate(['/login']);
        },
        (error) => {
          const errorRef = error?.message ? error.message : error;
          const errorMsg = this.parseSignUpError(errorRef);
          this.snackService.loadSnackBar(
            `Correo no encontrado. Verifica el correo electronico que ingresaste.`,
            'Cerrar'
          );

          console.error(`[forgot-pasword.component]: ${errorRef}`);
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
      case 'EMAIL_NOT_FOUND':
        return 'No existe un usuario registrado con este correo.';

      case 'MISSING_EMAIL':
        return 'Debes ingresar un correo valido';

      default:
        return errorStr;
    }
  }

}
