import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';


@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {
  constructor(
    public snackBarRef: MatSnackBarRef<SnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData
  ) { }

  message: string;
  dismissMessage: string;
  actionMessage: string;

  ngOnInit(): void {
    this.message = this.data.message;
    this.dismissMessage = this.data.dismissMessage && this.data.dismissMessage;
    this.actionMessage = this.data.actionMessage && this.data.actionMessage;
  }

  onAction() {
    this.snackBarRef.dismissWithAction();
  }

  onDismiss() {
    this.snackBarRef.dismiss();
  }

}

export class SnackBarData {
  message: string;
  dismissMessage?: string;
  actionMessage?: string;
}