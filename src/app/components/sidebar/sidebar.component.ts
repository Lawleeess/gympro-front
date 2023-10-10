import { Component, OnDestroy, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { Subscription } from 'rxjs';
import { Event, NavigationStart, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { MODULES, MODULES_TYPES } from 'src/app/constants/modules';
import { isEmpty } from 'lodash-es';
import { AppStateService } from 'src/app/services/app-state.service';
import { HostListener } from '@angular/core';

export const MOBILE_BREAKPOINT_PX = 768;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  sidebarColapse: boolean = false;
  user: User;
  NAV_DATA: NavNode[] = [];

  currentNavNode: NavNode;

  private transformer = (node: NavNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level,
      icon: node?.icon,
      redirectPath: node?.redirectPath,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener : any = new MatTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  public routeSub: Subscription;

  screenWidth: number;
  @HostListener('window:resize', ['$event'])
  onResize(event? : any) {
    this.adaptSidebarToWindowSize();
  }

  constructor(
    private router: Router,
    private userService: UserService,
    private appStateService: AppStateService
  ) {
    if (isEmpty(userService.user.modulesWithPermission)) {
      return;
    }

    for (const module of userService.user.modulesWithPermission!) {
      if (
        MODULES[module.name]  &&
        MODULES[module.name]['type'] == MODULES_TYPES.Module
      ) {
        this.NAV_DATA.push(MODULES[module.name]);
      } else {
        console.error(
          `[sidebar.component]: "${module.name}" is an invalid module name. Module not found in valid MODULES const`
        );
      }
    }

    if (!this.NAV_DATA.find((i) => i.id === MODULES.scriptingTool.id)) {
      this.NAV_DATA.push(MODULES.scriptingTool);
    }

    this.dataSource.data = this.NAV_DATA;
    this.user = this.userService.user;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  ngOnInit(): void {
    const currentUrl = this.router.url.split('?')[0];
    this.getCurrentNavItem(currentUrl);

    this.routeSub = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.getCurrentNavItem(event.url);
      }
    });

    this.adaptSidebarToWindowSize();
  }

  getCurrentNavItem(currentUrl : any): void {
    this.currentNavNode  = this.NAV_DATA.find((i) =>
      currentUrl.includes(i.redirectPath)
    )!;
  }

  setSidebarColapse(isColapsed: boolean): void {
    this.sidebarColapse = isColapsed;
    this.appStateService.sidebarIsColapsed = isColapsed;
  }

  adaptSidebarToWindowSize(): void {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < MOBILE_BREAKPOINT_PX) {
      this.setSidebarColapse(true);
    }
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
interface NavNode {
  id: string;
  name: string;
  children?: NavNode[];
  icon?: string;
  redirectPath?: string;
}

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
