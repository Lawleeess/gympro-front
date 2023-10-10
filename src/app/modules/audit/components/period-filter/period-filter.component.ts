import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DATE_PICKER_FORMAT } from 'src/app/constants/general';
import { UserService } from 'src/app/services/user.service';
import { PreferenceDetails, PreferenceTypes } from 'src/app/models/user';
import { MODULES, PAGES } from 'src/app/constants/modules';
import * as moment from 'moment';
import isEmpty from 'lodash-es/isEmpty';

export const PRESET_DATES = {
  last7Days: { value: 'last7days', label: 'Últimos 7 días' },
  last15Days: { value: 'last15days', label: 'Últimos 15 días' },
  last30Days: { value: 'last30days', label: 'Últimos 30 días' },
  custom: { value: 'custom', label: 'Periodo personalizado' },
};

@Component({
  selector: 'app-period-filter',
  templateUrl: './period-filter.component.html',
  styleUrls: ['./period-filter.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: DATE_PICKER_FORMAT },
  ],
})
export class PeriodFilterComponent
  implements OnInit, AfterContentChecked, OnDestroy
{
  private _disabled: boolean = true;
  get disabled(): boolean {
    return this._disabled;
  }
  @Input() set disabled(value: boolean) {
    this._disabled = value;

    // When form is disable or enable form values subscriptions detect a change
    // for that reason it's important to storage the last selection of values which have subscription
    // in this case form.presetDate (lastSelectedPresetDate variable) and form.startDate & form.endDate (lastSelectedPeriod variable)
    if (this.startDate && this.endDate) {
      if (value) {
        this.form.enabled && this.form.disable();
      } else {
        this.form.disabled && this.form.enable();
      }
    }
  }

  @Output() periodChange = new EventEmitter<Period>();

  form: FormGroup;
  formPresetDateSub: Subscription;
  formPeriodSub: Subscription;

  presetDate: AbstractControl;
  startDate: AbstractControl;
  endDate: AbstractControl;

  lastSelectedPresetDate: any;
  lastSelectedPeriod: Period;

  PRESET_DATES = Object.values(PRESET_DATES);

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private userService: UserService
  ) {}

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  getFormDefaultValues(
    savedPresetDate?: string,
    savedPeriod?: Period
  ): SelectedPeriod {
    let presetDate: string;
    let startDate: string;
    let endDate: string;
    if (!!savedPresetDate && !isEmpty(savedPeriod)) {
      presetDate = savedPresetDate;
      startDate = savedPeriod.startDate;
      endDate = savedPeriod.endDate;
    } else {
      const daysAgo = 30;
      presetDate = PRESET_DATES.last30Days.value;
      startDate = moment().subtract(daysAgo, 'd').format('YYYY-MM-DD');
      endDate = moment().format('YYYY-MM-DD');
    }

    const period: Period = {
      startDate,
      endDate,
    };

    return { presetDate, period };
  }

  loadForm(defaultPresetDate: string, defaultPeriod: Period): void {
    this.form = this.fb.group({
      presetDate: new FormControl(defaultPresetDate, [Validators.required]),
      startDate: new FormControl(defaultPeriod.startDate, [
        Validators.required,
      ]),
      endDate: new FormControl(defaultPeriod.endDate, [Validators.required]),
    });

    if (this.disabled) {
      this.form.disable();
    }

    this.presetDate = this.form.controls.presetDate;
    this.startDate = this.form.controls.startDate;
    this.endDate = this.form.controls.endDate;

    // emit the selection by default
    const period: Period = this.getPeriodInUTCFormat();
    this.periodChange.emit(period);
    this.lastSelectedPeriod = this.getPeriod();
    this.lastSelectedPresetDate = this.presetDate.value;

    this.formPresetDateSub = this.presetDate.valueChanges
      .pipe(debounceTime(5))
      .subscribe(() => {
        if (this.isFormValueChange()) {
          this.updatePeriodAfterPresetDateChanges();
          this.lastSelectedPresetDate = this.presetDate.value;
        }
      });

    this.formPeriodSub = this.endDate.valueChanges
      .pipe(debounceTime(5))
      .subscribe(() => {
        if (this.form.valid && this.isFormValueChange()) {
          const periodInUTC: Period = this.getPeriodInUTCFormat();
          this.periodChange.emit(periodInUTC);

          this.lastSelectedPeriod = this.getPeriod();
          this.saveSelectionInUserPreferences(
            this.presetDate.value,
            this.lastSelectedPeriod
          );
        }
      });
  }

  // update startDate and endDate values based on presetDate selection change
  updatePeriodAfterPresetDateChanges(): void {
    let startDate;
    let endDate = moment().format('YYYY-MM-DD');

    switch (this.presetDate.value) {
      case PRESET_DATES.last7Days.value:
        startDate = moment().subtract(7, 'd').format('YYYY-MM-DD');
        break;

      case PRESET_DATES.last15Days.value:
        startDate = moment().subtract(15, 'd').format('YYYY-MM-DD');
        break;

      case PRESET_DATES.last30Days.value:
        startDate = moment().subtract(30, 'd').format('YYYY-MM-DD');
        break;

      case PRESET_DATES.custom.value:
        startDate = null;
        endDate = null;
        break;
    }

    this.startDate.setValue(startDate);
    this.endDate.setValue(endDate);

    if (!!startDate && !!endDate) {
      this.startDate.disable();
      this.endDate.disable();
    } else {
      this.startDate.markAsUntouched();
      this.endDate.markAsUntouched();

      this.startDate.enable();
      this.endDate.enable();
    }
  }

  // validate if the form values really changed
  // or was a change emitted when enabling/disabling the form
  isFormValueChange(): boolean {
    const currentPeriod: Period = this.getPeriod();
    return (
      this.lastSelectedPresetDate !== this.presetDate.value ||
      this.lastSelectedPeriod.startDate !== currentPeriod.startDate ||
      this.lastSelectedPeriod.endDate !== currentPeriod.endDate
    );
  }

  // According with Angular material datepicker use Date type for startDate and endDate
  // but in code level, as moment.js is used to parse the selection in a Period type
  getPeriod(): Period {
    return {
      startDate: moment(this.startDate.value).format('YYYY-MM-DD'),
      endDate: moment(this.endDate.value).format('YYYY-MM-DD'),
    };
  }

  // For Audits module it's necessary to parse the selected dates to UTC format
  // it's is for Firestore setup when the data is queried
  getPeriodInUTCFormat(): Period {
    const period: Period = this.getPeriod();
    const today = moment();

    const startTime = today.startOf('day').format('HH:mm:ss');
    const endTime = today.endOf('day').format('HH:mm:ss');

    const startDateTime = moment(
      `${period.startDate} ${startTime}`,
      'YYYY-MM-DD HH:mm:ss'
    );
    const endDateTime = moment(
      `${period.endDate} ${endTime}`,
      'YYYY-MM-DD HH:mm:ss'
    );

    const periodInUTCFormat: Period = {
      startDate: moment.utc(startDateTime).format('YYYY-MM-DD'),
      endDate: moment.utc(endDateTime).format('YYYY-MM-DD'),
    };

    return periodInUTCFormat;
  }

  saveSelectionInUserPreferences(presetDate: string, period: Period) {
    const preference: PreferenceDetails = {
      name: 'period',
      type: PreferenceTypes.filterOption,
      value: {
        presetDate,
        period,
      },
    };

  }

  ngOnDestroy() {
    this.formPeriodSub?.unsubscribe();
    this.formPresetDateSub?.unsubscribe();
  }
}

export interface Period {
  startDate: string;
  endDate: string;
}

export interface SelectedPeriod {
  presetDate: string;
  period: Period;
}
