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
  userID: string;
  userLastName: string;
  birthday: string;
  phoneNumber: string;
  subscription: string;
  userEmail: string;

  loading: boolean = false; // Flag variable 
  selectedFile: File = null; // Variable to store file 
  userRole: string;

  constructor(
    private userService: UserService,
    private snackService: SnackBarService
  ) {
  }


  ngOnInit(): void {
    this.setUserValues();
  }


  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0]
  }

  onUpload() {
    this.loading = !this.loading; 
    const uploadData = new FormData();
    uploadData.append('image', this.selectedFile, this.selectedFile.name);

      this.reqStatus = 1;

        this.userService.uploadUserImage(uploadData, this.userID).subscribe(
          () => {
            this.reqStatus = 2;
            this.snackService.loadSnackBar(
              'Foto de perfil cargada con exito.',
              null,
              null, 
              7000
            );
            this.loading = false; // Flag variable  
            window.location.reload();
          },
          (error) => {
            const errorRef = error?.error?.message ? error.error.message : error;
            const errorMsg = this.parseSignUpError(errorRef);
            this.snackService.loadSnackBar(
              `Error al subir imagen. ${
                !!errorMsg ? errorMsg : 'Intente más tarde.'
              }`,
              'Cerrar'
            );
  
            console.error(`[user-info.component]: ${errorRef}`);
            this.reqStatus = 3;
          }
        );
  }

  setUserValues():void{
    this.userID = !!window.localStorage.getItem('user_id')
    ? JSON.parse(window.localStorage.getItem('user_id'))
    : null;
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
    this.userRole = !!window.localStorage.getItem('user_role')
    ? JSON.parse(window.localStorage.getItem('user_role'))
    : null;

    document.getElementById("userName").textContent = this.userName + " " + this.userLastName;
    document.getElementById("userEmail").textContent = this.userEmail;
    document.getElementById("userPhone").textContent = this.phoneNumber;
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
