import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  emailControl = new FormControl(
    null,
    Validators.compose([Validators.email, Validators.required])
  );
  passwordControl = new FormControl(
    null,
    Validators.compose([Validators.minLength(6), Validators.required])
  );

  reqStatus = 0;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackService: SnackBarService
  ) {
    const islogged = this.userService.isLoggedIn();

    if (islogged) {
      this.router.navigate(['/dashboard/home']);
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: this.emailControl,
      password: this.passwordControl,
    });
  }

  login(email: string, password: string): void {
    this.reqStatus = 1;
    if (this.form.valid) {
      this.userService.login(email, password).subscribe(
        () => {
          this.reqStatus = 2;
          this.snackService.loadSnackBar('Bienvenido', null, null, 3000);
          this.router.navigate(['/dashboard/home']);
        },
        (error) => {
          const errorMsg = error?.error?.message
            ? error.error.message
            : error?.message;
          console.error(`[login.component]: ${errorMsg}`);
          this.snackService.loadSnackBar(
            'Error al iniciar sesión. Intente más tarde',
            'Cerrar'
          );
          this.reqStatus = 3;
        }
      );
    }
  }
}
