import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDragPreview,
  CdkDrag,
  moveItemInArray,
  transferArrayItem,
  copyArrayItem,
} from '@angular/cdk/drag-drop';
import { UserRoutine } from 'src/app/models/user';


@Component({
  selector: 'app-routines',
  templateUrl: './routines.component.html',
  styleUrls: ['./routines.component.scss']
})
export class RoutinesComponent implements OnInit {


  
  constructor() { }

  ngOnInit(): void {
  }


}
