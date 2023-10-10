import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-tab-selector',
  templateUrl: './main-tab-selector.component.html',
  styleUrls: ['./main-tab-selector.component.scss']
})
export class MainTabSelectorComponent implements OnInit, OnDestroy {

  @Input() tabLinks: TabLink[];
  @Input() modulePath: string;

  path: string;

  routeSub: Subscription;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.path = this.router.url.replace(`${this.modulePath}/`, '');

    this.routeSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.path = this.router.url.replace(`${this.modulePath}/`, '');
        }
      });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

}

export class TabLink {
  pagePath: string;
  label: string;
}
