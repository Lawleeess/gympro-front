import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { GoalsInfo, SignupInfo, UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';
import { UserGoals,UserProgress } from 'src/app/models/user';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})


export class GoalsComponent implements OnInit {

  form: FormGroup;

  reqStatus = 0;
  showPassword: boolean = false;
  showValidatePassword: boolean = false;
  userID: string;
  userGoal : UserGoals;
  userProgress : UserProgress;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackService: SnackBarService
  ) {
  
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      age: ['', Validators.required],
      gender: ['hombre', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      activity: ['', Validators.required],
      goal: ['', Validators.required],
    });
    this.userID = !!window.localStorage.getItem('user_id')
    ? JSON.parse(window.localStorage.getItem('user_id'))
    : null;
    this.initGoals();
  }

  formatDate(): string {
    const date = new DatePipe('en-US').transform(this.form.controls['birthday'].value, 'yyyy-MM-dd')
    return date
  }

  registerGoals(): void {
    this.reqStatus = 1;
    if (this.form.valid) {
      const goals: GoalsInfo = {
        age: this.form.controls['age'].value,
        gender: this.form.controls['gender'].value,
        height: this.form.controls['height'].value,
        weight: this.form.controls['weight'].value,
        activity: this.form.controls['activity'].value,
        goal: this.form.controls['goal'].value,
      };
      this.userService.registerGoals(goals, this.userID).subscribe(
        (userGoal: UserGoals) => {
          this.reqStatus = 2;
          this.snackService.loadSnackBar(
            'Metas obtenidas con exito',
            null,
            null,
            7000
          );
          this.setGoals(userGoal, goals);
          // window.location.reload();
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

          console.error(`[registerGoals.component]: ${errorRef}`);
          this.reqStatus = 3;
        }
      );
    }
  }

  setGoals(userGoal: UserGoals, goalsInfo: GoalsInfo){
    document.getElementById("imc").setAttribute("value", userGoal.imc + " kg/m²");
    document.getElementById("bmr").setAttribute("value", userGoal.bmr + " kcal/día");
    document.getElementById("tdee").setAttribute("value", userGoal.tdee + " kcal/día");
    document.getElementById("goal").setAttribute("value", userGoal.goal + " kcal/día");
    document.getElementById("protein").setAttribute("value", userGoal.protein + " g/día");
    document.getElementById("carbs").setAttribute("value", userGoal.carbs + " g/día");
    document.getElementById("fat").setAttribute("value", userGoal.fat + " g/día");


    window.localStorage.setItem(
      'userProgress',
      JSON.stringify(goalsInfo)
    );
  }

  initGoals(){
    this.userProgress = !!window.localStorage.getItem('userProgress')
    ? JSON.parse(window.localStorage.getItem('userProgress'))
    : null;

    if (this.userProgress.age != null && this.userProgress.goal != null) {
      this.form.controls['age'].setValue(this.userProgress.age)
      this.form.controls['gender'].setValue(this.userProgress.gender)
      this.form.controls['height'].setValue(this.userProgress.height)
      this.form.controls['weight'].setValue(this.userProgress.weight)
      this.form.controls['activity'].setValue(this.userProgress.activity)
      this.form.controls['goal'].setValue(this.userProgress.goal)
    }

 
    this.userGoal = !!window.localStorage.getItem('userGoals')
    ? JSON.parse(window.localStorage.getItem('userGoals'))
    : null;
    
    if (this.userGoal.imc != null && this.userGoal.protein != null) {
      document.getElementById("imc").setAttribute("value", this.userGoal.imc + " kg/m²");
      document.getElementById("bmr").setAttribute("value", this.userGoal.bmr + " kcal/día");
      document.getElementById("tdee").setAttribute("value", this.userGoal.tdee + " kcal/día");
      document.getElementById("goal").setAttribute("value", this.userGoal.goal + " kcal/día");
      document.getElementById("protein").setAttribute("value", this.userGoal.protein + " g/día");
      document.getElementById("carbs").setAttribute("value", this.userGoal.carbs + " g/día");
      document.getElementById("fat").setAttribute("value", this.userGoal.fat + " g/día");
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

