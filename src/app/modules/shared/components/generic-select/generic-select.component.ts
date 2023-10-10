import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { REQ_STATUS } from 'src/app/constants/general';
import { isEqual, isEmpty } from 'lodash-es';
@Component({
  selector: 'app-generic-select',
  templateUrl: './generic-select.component.html',
  styleUrls: ['./generic-select.component.scss'],
})
export class GenericSelectComponent implements OnInit {
  @Input() label: string = 'Selecciona una opción';
  @Input() required: boolean;
  @Input() searchFilter: boolean; // show search filter when optionList.length > 3
  @Input() errorMsg: string;
  @Input() emptyMsg: string;
  @Input() extraPropName: string; // To show this property in trigger and options
  @Input() standaloneOption: { name: string; standalone: boolean }; // To show a custom standalone option

  private _optionList: selectItem[] | string[] | number[];
  get optionList() {
    return this._optionList;
  }
  @Input() set optionList(value: selectItem[] | string[] | number[]) {
    this._optionList = value;
    this.initOptionList = value;

    this.selectionByDefault(this.selectedOption);
  }

  private _selectedOption: selectItem | string | number;
  get selectedOption() {
    return this._selectedOption;
  }

  @Input() set selectedOption(value: selectItem | string | number) {
    this._selectedOption = value;
    this.selectionByDefault(this._selectedOption);
  }

  private _disabled: boolean;
  get disabled() {
    return this._disabled;
  }
  @Input() set disabled(value: boolean) {
    this._disabled = value;

    if (this.disabled) {
      this.option.disable();
    } else {
      this.option.enable();
    }
  }

  private _status: number = REQ_STATUS.SUCCESS; //init state (0) | loader (1) | ready (2) | error (3)
  get status() {
    return this._status;
  }
  @Input() set status(value: number) {
    this._status = value;

    if (this.status < 2 || this.disabled) {
      this.option.disable();
    } else {
      this.option.enable();
    }
  }

  @Input() set resetSelection(value: boolean) {
    value && this.resetSelectedOption();
    this.searchedWord && delete this.searchedWord;
  }

  @Output() selectedOptionChange = new EventEmitter<
    selectItem | string | number
  >();

  option: FormControl = new FormControl({ value: null, disabled: true });
  initOptionList;
  searchedWord: string;

  constructor() {}

  ngOnInit(): void {
    this.option = !this.required
      ? new FormControl()
      : new FormControl('', [Validators.required]);
  }

  selectOption() {
    this.selectedOption = this.option.value;

    // clear filter and restore optionList
    if (this.searchedWord) {
      delete this.searchedWord;
      this._optionList = [...this.initOptionList];
    }

    this.selectedOptionChange.emit(this.selectedOption);
  }

  selectionByDefault(selectedOption: selectItem | string | number): void {
    if (!!selectedOption && !isEmpty(this.optionList)) {
      const selectedOptByDefault = this.initOptionList.find((i) =>
        isEqual(i, selectedOption)
      );

      selectedOption = selectedOptByDefault;
      this.option.setValue(selectedOptByDefault);
    } else if (!selectedOption) {
      this.option.reset();
    }
  }

  search() {
    if (!this.searchedWord) {
      this._optionList = this.initOptionList;
      return;
    }

    const search = this.searchedWord.toLocaleLowerCase();
    this._optionList = this.initOptionList.filter((item) => {
      // options are number | string
      if (!item.name) {
        return item.toLowerCase().includes(search);
      }

      // options are selectItem and there isn't extraPropName
      if (!this.extraPropName) {
        return item.name.toLowerCase().includes(search);
      }

      // options are selectItem and there is extraPropName
      return (
        item.name.toLowerCase().includes(search) ||
        item[this.extraPropName].toLowerCase().includes(search)
      );
    });
  }

  openedChange(opened) {
    // reset search without results if select is closed
    if (!opened && this.searchedWord && this.optionList.length < 1) {
      this._optionList = [...this.initOptionList];
      delete this.searchedWord;
    }
  }

  resetSelectedOption() {
    this.option.setValue(null);
    delete this.selectedOption;
  }
}

export class selectItem {
  id: number | string;
  name: string;
}
