import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private _sidebarIsColapsed: boolean = false;
  private sidebarIsColapsedSource = new Subject<boolean>();
  $sidebarIsColapsed = this.sidebarIsColapsedSource.asObservable();

  constructor() {}

  get sidebarIsColapsed(): boolean {
    return this._sidebarIsColapsed;
  }

  set sidebarIsColapsed(value: boolean) {
    this._sidebarIsColapsed = value;
    this.sidebarIsColapsedSource.next(this._sidebarIsColapsed);
  }
}
