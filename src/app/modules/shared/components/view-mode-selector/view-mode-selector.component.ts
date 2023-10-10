import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { VIEW_MODES } from 'src/app/constants/general';
import { ViewMode } from 'src/app/tools/types/global';

@Component({
  selector: 'app-view-mode-selector',
  templateUrl: './view-mode-selector.component.html',
  styleUrls: ['./view-mode-selector.component.scss'],
})
export class ViewModeSelectorComponent implements OnInit, OnChanges {
  viewModes: ViewModeItem[] = [...VIEW_MODES];

  @Input() viewModeSelected: ViewMode = 'cards';
  @Output() viewModeChange = new EventEmitter<ViewMode>();

  viewModeSelectedItem: ViewModeItem;
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.viewModeSelectedItem = VIEW_MODES.find(
      (i) => i.mode === this.viewModeSelected
    );
  }

  selectViewMode(selection: ViewMode) {
    this.viewModeSelected = selection;
    this.viewModeChange.emit(this.viewModeSelected);
  }
}

export interface ViewModeItem {
  mode: ViewMode; // mode value for .ts & .html
  label: string; // mode value for user
  icon: string; // valid icon reference by class using <i> element (using Font Awesome library)
}
