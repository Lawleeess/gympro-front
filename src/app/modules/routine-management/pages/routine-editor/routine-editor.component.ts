import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { REQ_STATUS } from 'src/app/constants/general';
import { User } from 'src/app/models/user';
import { UsersManagementService } from 'src/app/modules/users-management/services/users-management.service';

@Component({
  selector: 'app-routine-editor',
  templateUrl: './routine-editor.component.html',
  styleUrls: ['./routine-editor.component.scss']
})
export class RoutineEditorComponent implements OnInit {

  userID: string;
  errorMsg: string;
  user: User | any;

  routineReqStatus: number = REQ_STATUS.INITIAL;


  constructor(     private route: ActivatedRoute,  private usersManagementService: UsersManagementService, ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (!!params.id) {
        this.userID = params.id;
        this.user = {}
      } else {
        console.error(
          '[user-details.component]: not user id provided as query param in the route'
        );
        this.errorMsg = 'No fue posible encontrar el id del usuario.';
      }
    });

  }

  async getUser() {
    this.routineReqStatus = REQ_STATUS.LOADING;

    this.usersManagementService.getUser(this.userID).subscribe(
      (resp: User) => {
        this.user = resp;

        this.routineReqStatus = REQ_STATUS.SUCCESS;
      },
      (error) => {
        this.routineReqStatus = REQ_STATUS.ERROR;
        console.error(error);
      }
    );

    this.user = await this.usersManagementService.getUser(this.userID).toPromise();
  }

}

