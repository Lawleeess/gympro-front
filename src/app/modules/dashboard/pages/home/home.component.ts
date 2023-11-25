import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { REQ_STATUS } from 'src/app/constants/general';
import { Routine, User, UserRoutine } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import localeEs from '@angular/common/locales/es'
import { formatDate, registerLocaleData } from '@angular/common';
import * as moment from 'moment';

registerLocaleData(localeEs,'es');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [{provide: LOCALE_ID, useValue:'es'}]
})
export class HomeComponent implements OnInit {
  user: User;
  customers: any[];
  customersReqStatus: number = REQ_STATUS.INITIAL;

  campaigns: any[];
  campaignsReqStatus: number = REQ_STATUS.INITIAL;

  haveRoutine: boolean = false;
  dayOfWeek: string;
  difDate: number;
  todayRoutine: Routine[];
  status: number = REQ_STATUS.INITIAL;
  currentDate: string;
  // campaigns: any[] = [
  //   {
  //     id: 1,
  //     name: 'aw_chedraui_branding_see_local-campaign_fds',
  //     provider: 'ads'
  //   },
  // ];

  constructor(
    private userService: UserService
  ) {
    this.user = this.userService.user;
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'es');
    this.difDate =  moment(new Date(this.user.subscription)).diff(moment(new Date(this.currentDate)), 'days');

  }

  ngOnInit(): void {
    this.getCustomers();
    this.user.userRoutine = !!window.localStorage.getItem('userRoutine')
    ? JSON.parse(window.localStorage.getItem('userRoutine'))
    : null;
    this.status = REQ_STATUS.INITIAL
    let days = ["Domingo","Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    days.forEach((day,index)=>{
      if(index == new Date().getDay()){
        this.dayOfWeek = day
        }
      });

    if(this.dayOfWeek == "Lunes"){
      if (this.user.userRoutine.monday.length > 0){
        this.todayRoutine = this.user.userRoutine.monday;
        this.haveRoutine = true;
      }
    }else if(this.dayOfWeek == "Martes"){
      if (this.user.userRoutine.tuesday.length > 0){
        this.todayRoutine = this.user.userRoutine.tuesday;
        this.haveRoutine = true;
      }
    }else if(this.dayOfWeek == "Miércoles"){
      if (this.user.userRoutine.wednesday.length > 0){
        this.todayRoutine = this.user.userRoutine.wednesday;
        this.haveRoutine = true;
      }
    }else if(this.dayOfWeek == "Jueves"){
      if (this.user.userRoutine.thursday.length > 0){
        this.todayRoutine = this.user.userRoutine.thursday;
        this.haveRoutine = true;
      }
    }else if(this.dayOfWeek == "Viernes"){
      if (this.user.userRoutine.friday.length > 0){
        this.todayRoutine = this.user.userRoutine.friday;
        this.haveRoutine = true;
      }
    }else if(this.dayOfWeek == "Sábado"){
      if (this.user.userRoutine.saturday.length > 0){
        this.todayRoutine = this.user.userRoutine.saturday;
        this.haveRoutine = true;
      }
    }else if(this.dayOfWeek == "Domingo"){
        this.haveRoutine = false;
    }
    this.status = REQ_STATUS.SUCCESS
  } 

  initUser():void{
    this.user.id = !!window.localStorage.getItem('user_id')
    ? JSON.parse(window.localStorage.getItem('user_id'))
    : null;
    this.user.url_image = !!window.localStorage.getItem('url_image')
    ? JSON.parse(window.localStorage.getItem('url_image'))
    : null;
    this.user.name = !!window.localStorage.getItem('user_name')
    ? JSON.parse(window.localStorage.getItem('user_name'))
    : null;
    this.user.lastname = !!window.localStorage.getItem('user_lastname')
    ? JSON.parse(window.localStorage.getItem('user_lastname'))
    : null;
    this.user.email = !!window.localStorage.getItem('user_email')
    ? JSON.parse(window.localStorage.getItem('user_email'))
    : null;
    this.user.birthday = !!window.localStorage.getItem('birthday')
    ? JSON.parse(window.localStorage.getItem('birthday'))
    : null;
    this.user.phone_number = !!window.localStorage.getItem('phone_number')
    ? JSON.parse(window.localStorage.getItem('phone_number'))
    : null;
    this.user.subscription = !!window.localStorage.getItem('subscription')
    ? JSON.parse(window.localStorage.getItem('subscription'))
    : null;
    this.user.userRoutine = !!window.localStorage.getItem('userRoutine')
    ? JSON.parse(window.localStorage.getItem('userRoutine'))
    : null;
  }

  getCustomers(): void {
    this.customersReqStatus = REQ_STATUS.LOADING;
  }
}
