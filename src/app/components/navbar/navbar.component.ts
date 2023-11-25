import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MODULES } from 'src/app/constants/modules';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: User;
  module: string;

  userSubs: Subscription;
  routeSub: Subscription;
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.user;
    this.module = this.getCurrentModule();

    this.userSubs = this.userService.user$.subscribe((res) => {
      this.user = res;
    });

    this.routeSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.module = this.getCurrentModule();
        }
      });
  }

  getCurrentModule(): string {
    const route = this.router.url;

    if (route.includes('/dashboard/home')) {
      return 'Inicio';
    }else if (route.includes('/dashboard/register')) {
      return 'Nuevo administrador';
    }

    const module = Object.values(MODULES).find((i) =>
      route.includes(i.redirectPath)
    );
    return module?.name || '';
  }

  logout(): void {
    this.userService.logout();
  }

  profile(): void {
    this.router.navigate(['/dashboard/profile'])
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.userSubs?.unsubscribe();
  }
}
