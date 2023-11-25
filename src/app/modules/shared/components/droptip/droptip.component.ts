import { Component, ContentChildren, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-droptip',
  templateUrl: './droptip.component.html',
  styleUrls: ['./droptip.component.scss'],
})
export class DroptipComponent implements OnInit {
  @Input() icon: string = 'fas fa-info-circle'; //valid css class of font awesome icon

  constructor() {}

  ngOnInit(): void {}
}
