import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  copyArrayItem,
} from '@angular/cdk/drag-drop';
import { UserRoutine } from 'src/app/models/user';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { UserService } from 'src/app/services/user.service';
import { Routine } from '../../../../models/user';
import { element } from 'protractor';
import { ActivatedRoute, Router } from '@angular/router';
import { REQ_STATUS } from 'src/app/constants/general';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.component.html',
  styleUrls: ['./calendar-list.component.scss'],
})

export class CalendarListComponent implements OnInit {

  userID: string;
  userRoutine: UserRoutine;
  userRoutineSave: UserRoutine;
  routineMonday:Item[] = [];
  routineTuesday:Item[]= [];
  routineWednesday :Item[]= [];
  routineThursday:Item[]= [];
  routineFriday:Item[]= [];
  routineSaturday:Item[]= [];
  status: number = REQ_STATUS.INITIAL;
  errorMsg: string;

  monday: Routine[] = [];
  tuesday : Routine[] = [];
  wednesday : Routine[] = [];
  thursday : Routine[] = [];
  friday : Routine[] = [];
  saturday: Routine[] = [];

  oGroutineMonday = [];
  oGroutineTuesday = [];
  oGroutineWednesday = [];
  oGroutineThursday = [];
  oGroutineFriday = [];
  oGroutineSaturday= [];

  isClear: boolean = false;

  showListExercises: boolean = false;

  routines: Routine[];
  muscleGroup: string;
  routineByMuscle= [];
  selectedMuscle: string;
  muscleGroups = [{value: "peck", label: "Pecho"}, {value: "back", label: "Espalda"},
                  {value: "shoulders", label: "Hombros"}, {value: "biceps", label: "Bíceps"},
                  {value: "triceps", label: "Tríceps"}, {value: "abs", label: "Abdominales"},
                  {value: "legs", label: "Piernas"}, {value: "gemelos", label: "Gemelos"},];

  constructor( private userService: UserService, private snackService: SnackBarService, private router: Router) { }

  ngOnInit(): void {
    this.userID = !!window.localStorage.getItem('user_id')
    ? JSON.parse(window.localStorage.getItem('user_id'))
    : null;
    this.initGoals();
    this.initRoutines();
    if (this.routineMonday.length === 0 && this.routineTuesday.length === 0 &&
        this.routineWednesday.length === 0 && this.routineThursday.length === 0 &&
        this.routineFriday.length === 0 && this.routineSaturday.length === 0){
          
      this.isClear = true
    }
  }
  initGoals(){
    this.userRoutine = !!window.localStorage.getItem('userRoutine')
    ? JSON.parse(window.localStorage.getItem('userRoutine'))
    : null;
  }

  toListExercises(): void{
    this.router.navigate(['/dashboard/exercises']);
  }

  initRoutines(){
    for (let index = 0; index < this.userRoutine.monday.length; index++) {
      const item = {value: this.userRoutine.monday[index], disabled: true}
      this.routineMonday.push(item)
    }
    for (let index = 0; index < this.userRoutine.tuesday.length; index++) {
      const item = {value: this.userRoutine.tuesday[index], disabled: true}
      this.routineTuesday.push(item)
    }
    for (let index = 0; index < this.userRoutine.wednesday.length; index++) {
      const item = {value: this.userRoutine.wednesday[index], disabled: true}
      this.routineWednesday.push(item)
    }
    for (let index = 0; index < this.userRoutine.thursday.length; index++) {
      const item = {value: this.userRoutine.thursday[index], disabled: true}
      this.routineThursday.push(item)
    }
    for (let index = 0; index < this.userRoutine.friday.length; index++) {
      const item = {value: this.userRoutine.friday[index], disabled: true}
      this.routineFriday.push(item)
    }
    for (let index = 0; index < this.userRoutine.saturday.length; index++) {
      const item = {value: this.userRoutine.saturday[index], disabled: true}
      this.routineSaturday.push(item)
    }
    
    this.oGroutineMonday = this.routineMonday;
    this.oGroutineTuesday = this.routineTuesday;
    this.oGroutineWednesday = this.routineWednesday;
    this.oGroutineThursday = this.routineThursday;
    this.oGroutineFriday = this.routineFriday;
    this.oGroutineSaturday= this.routineSaturday;
  
  }


  getRoutine(muscleGroup: string) {
    this.status = REQ_STATUS.LOADING
    this.routineByMuscle = []
    this.muscleGroup = this.parseMuscleGroup(muscleGroup)
        this.userService.getRoutines(muscleGroup).subscribe(
          (routines: Routine[]) => {
            this.routines = routines;
            if (this.routines?.length > 0){
              for (let index = 0; index < this.routines.length; index++) {
                const item = {value: this.routines[index], disabled: false}
                this.routineByMuscle.push(item)
              }
            }
            this.status = REQ_STATUS.SUCCESS
          },
          (error) => {
            const errorRef = error?.error?.message ? error.error.message : error;
            const errorMsg = this.parseSignUpError(errorRef);
            console.error(`[calendar.component]: ${errorRef}`);
          }
        );


  }

  parseMuscleGroup(muscle: string): string{
    if (muscle == "peck"){
      return "Pecho"
    }else if (muscle == "back"){
      return "Espalda"
    }else if (muscle == "shoulders"){
      return "Hombros"
    }else if (muscle == "biceps"){
      return "Bíceps"
    }else if (muscle == "triceps"){
      return "Tríceps"
    }else if (muscle == "abs"){
      return "Abdominales"
    }else if (muscle == "legs"){
      return "Piernas"
    }else if (muscle == "gemelos"){
      return "Gemelos"
    }
  }

  clearVariables(){
    this.monday = []
    this.tuesday = []
    this.wednesday = []
    this.thursday = []
    this.friday = []
    this.saturday = []
  }

  saveRoutine(){   
  this.clearVariables()
  this.routineMonday.forEach(element => {
    this.monday.push(element.value)
  });
  this.routineTuesday.forEach(element => {
    this.tuesday.push(element.value)
  });
  this.routineWednesday.forEach(element => {
    this.wednesday.push(element.value)
  });
  this.routineThursday.forEach(element => {
    this.thursday.push(element.value)
  });
  this.routineFriday.forEach(element => {
    this.friday.push(element.value)
  });
  this.routineSaturday.forEach(element => {
    this.saturday.push(element.value)
  });

  this.userRoutineSave = {monday:this.monday, tuesday: this.tuesday, 
                          wednesday: this.wednesday, thursday: this.thursday, 
                          friday: this.friday, saturday: this.saturday}

  


      this.userService.saveRoutinesUser(this.userID, this.userRoutineSave).subscribe(
        () => {
          this.snackService.loadSnackBar(
            'Rutina guardada con exito',
            null,
            null,
            7000
          );

          window.localStorage.setItem(
            'userRoutine',
            JSON.stringify(this.userRoutineSave)
          );
        },
        (error) => {
          const errorRef = error?.error?.message ? error.error.message : error;
          const errorMsg = this.parseSignUpError(errorRef);
          this.snackService.loadSnackBar(
            `Error al guardar rutina. ${
              !!errorMsg ? errorMsg : 'Intente más tarde.'
            }`,
            'Cerrar'
          );

          console.error(`[calendar-list.component]: ${errorRef}`);
        }
      );
    
  }

  clear(){
    this.routineMonday = [];
    this.routineTuesday = [];
    this.routineWednesday = [];
    this.routineThursday = [];
    this.routineFriday = [];
    this.routineSaturday = [];
    
    this.isClear = true;
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

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.loopCalendar();
      this.isClear = false;
    }
  }

  loopCalendar(){
    for (let index = 0; index < this.routineMonday.length; index++) {
      this.routineMonday[index].disabled = true;
    }
    for (let index = 0; index < this.routineTuesday.length; index++) {
      this.routineTuesday[index].disabled = true;
    }
    for (let index = 0; index < this.routineWednesday.length; index++) {
      this.routineWednesday[index].disabled = true;
    }
    for (let index = 0; index < this.routineThursday.length; index++) {
      this.routineThursday[index].disabled = true;
    }
    for (let index = 0; index < this.routineFriday.length; index++) {
      this.routineFriday[index].disabled = true;
    }
    for (let index = 0; index < this.routineSaturday.length; index++) {
      this.routineSaturday[index].disabled = true;
    }
  }
}

export interface Item {
  value: Routine;
  disabled: boolean;
}
