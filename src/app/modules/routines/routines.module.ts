import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutinesComponent } from './routines.component';
import { CalendarListComponent } from './components/calendar-list/calendar-list.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    RoutinesComponent,
    CalendarListComponent,

  ],
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    FormsModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,

  ]
})
export class RoutinesModule { }
