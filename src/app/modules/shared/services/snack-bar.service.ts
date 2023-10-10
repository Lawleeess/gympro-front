import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  snackBarRef;
  forcedDismiss: boolean;

  constructor(private _snackBar: MatSnackBar) { }

  /**
   * Loads snack bar
   * @param message main message shown in snack-bar component
   * @param [dismissMessage] dismiss button message
   * @param [actionMessage] actiion button message
   * @param [duration] snackbar duration on screen
   * @returns void or a promise with true response when snackbar is closed by action button
   */
  loadSnackBar(message: string, dismissMessage?: string, actionMessage?: string, duration?: number): any {
    const config: any = { data: { message, dismissMessage, actionMessage } };

    if (duration) {
      config.duration = duration;
    } else {
      config.duration = 5000;
    }

    this.snackBarRef = this._snackBar.openFromComponent(SnackBarComponent, config);

    if (!actionMessage) {
      return;
    }

    return this.snackBarRef.onAction().toPromise()
      .then((resp) => {
        if (!this.forcedDismiss) {
          this.forcedDismiss = true;
          return true;
        }
      });
  }

  dismissSnackBar(): void {
    this.snackBarRef?.dismiss();
    this.forcedDismiss = true;
  }
}
