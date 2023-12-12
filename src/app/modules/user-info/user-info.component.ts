import { registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { SignupInfo, UserService } from 'src/app/services/user.service';
import localeEs from '@angular/common/locales/es'
import { UserInfoService } from './services/user-info.service';
import { REQ_STATUS } from 'src/app/constants/general';
import { User } from 'src/app/models/user';

registerLocaleData(localeEs,'es');

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  providers: [{provide: LOCALE_ID, useValue:'es'}]
})
export class UserInfoComponent implements OnInit {

  form: FormGroup;
  infoReqStatus
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

  user: User | any = {};

  loading: boolean = false; // Flag variable 
  selectedFile: File = null; // Variable to store file 
  userRole: string;

  constructor(
    private userService: UserService,
    private snackService: SnackBarService,
    private userInfoService: UserInfoService,
  ) {
  }


  ngOnInit(): void {
    this.getUser()    
  }

  async getUser() {
    this.userID = !!window.localStorage.getItem('user_id')
    ? JSON.parse(window.localStorage.getItem('user_id'))
    : null;


    this.infoReqStatus = REQ_STATUS.LOADING;

    this.user = await this.userInfoService.getUser(this.userID).toPromise();
    this.infoReqStatus = REQ_STATUS.SUCCESS;

    document.getElementById("userName").textContent = this.user.name + " " + this.user.lastname;
    document.getElementById("userEmail").textContent = this.user.email;
    document.getElementById("userBirthday").textContent = this.user.birthday;
    document.getElementById("userPhone").textContent = this.user.phone_number;
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
