import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  modalType: string; // decision or info
  // decision to use true and false buttons
  // info to use only true button
  imageType: string; // warning or other options not considered at the moment
  question: string;
  content: string[];
  trueBtn: string;
  falseBtn: string;
  facebookBtn: boolean;
  trueBtnColor: string;
  falseBtnColor: string;
  trueBtnDirection: string; // right or left
  legendLink: string;
  srcLink: string;

  constructor(public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalProperties) { }

  ngOnInit(): void {
    this.modalType = this.data.modalType === 'info' ? 'info' : 'decision';
    this.question = this.data.question;
    this.content = this.data.content ? this.data.content : [];
    this.trueBtn = this.data.trueBtn ? this.data.trueBtn : 'Aceptar';
    this.trueBtnColor = this.data.trueBtnColor ? this.data.trueBtnColor : 'primary';
    this.trueBtnDirection = this.data.trueBtnDirection ? this.data.trueBtnDirection : 'right';

    if (this.modalType === 'decision') {
      this.falseBtn = this.data.falseBtn ? this.data.falseBtn : 'Cancelar';
      this.falseBtnColor = this.data.falseBtnColor && this.data.falseBtnColor;
    }

    if (this.data.imageType) {
      this.imageType = this.data.imageType;
    }

    if (this.data.legendLink) {
      this.legendLink = this.data.legendLink;
      this.srcLink = this.data.srcLink;
    }
  }
}

export interface ModalProperties {
  modalType?: string;
  imageType?: string;
  question?: string;
  content?: string[];
  trueBtn?: string;
  falseBtn?: string;
  trueBtnColor?: string;
  falseBtnColor?: string;
  trueBtnDirection?: string;
  legendLink?: string;
  srcLink?: string;
}
