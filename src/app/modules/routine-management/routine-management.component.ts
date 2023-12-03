import { Component, OnInit } from '@angular/core';
import { REQ_STATUS } from 'src/app/constants/general';
import { UsersParams } from './components/users-list/users-list.component';
import { UsersManagementService } from '../users-management/services/users-management.service';

@Component({
  selector: 'app-routine-management',
  templateUrl: './routine-management.component.html',
  styleUrls: ['./routine-management.component.scss']
})
export class RoutineManagementComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}
