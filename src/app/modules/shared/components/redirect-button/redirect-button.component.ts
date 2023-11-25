import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-redirect-button',
  templateUrl: './redirect-button.component.html',
  styleUrls: ['./redirect-button.component.scss'],
})
export class RedirectButtonComponent implements OnInit {
  @Input() text = 'Regresar';
  @Input() icon: string; // valid css class for <i></i>
  @Input() redirectRoute: string; // valid route for router
  @Input() queryParams: object[];

  constructor() {}

  ngOnInit(): void {}
}
