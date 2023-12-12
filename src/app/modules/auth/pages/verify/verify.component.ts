import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  form: FormGroup;
  reqStatus = 0;
  email: string;
  oobCode: string;
  errorMsg: string;
  constructor(    private fb: FormBuilder, private route: ActivatedRoute, private userService: UserService, private snackService: SnackBarService, private router: Router
    ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      if (!!params.email) {
        this.email = params.email;
      } else {
        console.error(
          '[user-details.component]: not email provided as query param in the route'
        );
        this.errorMsg = 'No fue posible encontrar el email del usuario.';
      }
      if (!!params.oobCode) {
        this.oobCode = params.oobCode;
      } else {
        this.oobCode = "";
        console.warn(
          '[user-details.component]: not oobCode provided as query param in the route'
        );
        this.errorMsg = 'No fue posible encontrar el oobCode del usuario.';
      }
    });

    this.form = this.fb.group({
     code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });

    document.getElementById("oobCode").textContent = this.oobCode;

  }

  verify(): void{

    const data: VerifyUser = {
      email: this.email,
      oobCode: this.form.controls['code'].value,
    };

    this.userService.verifyCode(data).subscribe(
      () => {
        this.reqStatus = 2;
        this.snackService.loadSnackBar(
          'Registro validado con exito.',
          null,
          null,
          7000
        );
        this.router.navigate(['/auth/login']);
      },
      (error) => {
        const errorRef = error.error.message
        const errorMsg = (errorRef);
        this.snackService.loadSnackBar(
          `Error al verificar. ${
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


export interface VerifyUser {
  email  : string 
	oobCode : string 
}