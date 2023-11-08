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

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.component.html',
  styleUrls: ['./calendar-list.component.scss'],
})
export class CalendarListComponent implements OnInit {

  userID: string;
  userRoutine: UserRoutine;
  routineMonday = [];
  routineTuesday = [];
  routineWednesday = [];
  routineThursday = [];
  routineFriday = [];
  routineSaturday= [];

  oGroutineMonday = [];
  oGroutineTuesday = [];
  oGroutineWednesday = [];
  oGroutineThursday = [];
  oGroutineFriday = [];
  oGroutineSaturday= [];

  isClear: boolean = false;

  routine: Routine[];
  muscleGroup: string;
  routineByMuscle= [];
  selectedMuscle: string;
  muscleGroups = [{value: "peck", label: "Pecho"}, {value: "back", label: "Espalda"}];

  constructor( private userService: UserService) { }

  ngOnInit(): void {
    this.userID = !!window.localStorage.getItem('user_id')
    ? JSON.parse(window.localStorage.getItem('user_id'))
    : null;
    this.initGoals();
    this.initRoutines();
  }
  initGoals(){
    this.userRoutine = !!window.localStorage.getItem('userRoutine')
    ? JSON.parse(window.localStorage.getItem('userRoutine'))
    : null;
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
    this.routineByMuscle = []
    this.muscleGroup = this.parseMuscleGroup(muscleGroup)
        this.userService.getRoutines(muscleGroup).subscribe(
          (routine: Routine[]) => {
            this.routine = routine;
            if (this.routine?.length > 0){
              for (let index = 0; index < this.routine.length; index++) {
                const item = {value: this.routine[index], disabled: false}
                this.routineByMuscle.push(item)
              }
            }
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

  send(){
   console.log(this.routineMonday)
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
