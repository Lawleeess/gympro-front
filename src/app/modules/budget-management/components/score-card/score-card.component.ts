import { Component, Input, OnInit } from '@angular/core';
import { ValueFormat } from 'src/app/tools/types/global';

@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.component.html',
  styleUrls: ['./score-card.component.scss'],
})
export class ScoreCardComponent implements OnInit {
  @Input() title: string;
  @Input() total: number;
  @Input() totalFormat: ValueFormat;
  @Input() decimalsInTotal: number;
  @Input() iconClass: string; // css class of icon reference using Font Awesome icons
  @Input() bgClass: string; // background color class (classes of epa-theme are declared in src/assets/styles/base/_helpers.scss)
  @Input() loader: boolean;

  constructor() {}

  ngOnInit(): void {}
}
