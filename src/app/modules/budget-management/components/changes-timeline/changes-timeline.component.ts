import { Component, Input, OnInit } from '@angular/core';
import { REQ_STATUS } from 'src/app/constants/general';
import { ValueFormat } from 'src/app/tools/types/global';

@Component({
  selector: 'app-changes-timeline',
  templateUrl: './changes-timeline.component.html',
  styleUrls: ['./changes-timeline.component.scss'],
})
export class ChangesTimelineComponent implements OnInit {
  @Input() list: TimeLineChanges[] = [];
  @Input() status: number = REQ_STATUS.INITIAL;

  constructor() {}

  ngOnInit(): void {
    if (this.status === undefined) {
      this.status = REQ_STATUS.SUCCESS;
    }
  }
}

export interface TimeLineChanges {
  id: string;
  accountID: string;
  clientID: string;
  date: string;
  description: string;
  field: string;
  module: string;
  previousValue: number;
  newValue: number;
  valueFormat: ValueFormat;
  author: {
    authorID: string;
    authorName: string;
  };
  action: 'update' | 'create';
}
