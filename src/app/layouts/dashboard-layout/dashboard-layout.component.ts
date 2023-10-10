import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent implements OnInit {
  isSidebarColapsed: boolean = false;
  sidebarSub: Subscription;

  constructor(private appStateService: AppStateService) {}

  ngOnInit(): void {
    this.sidebarSub = this.appStateService.$sidebarIsColapsed.subscribe(
      (resp) => {
        this.isSidebarColapsed = resp;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
