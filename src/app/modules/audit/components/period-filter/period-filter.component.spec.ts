import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigurationProvider } from 'src/app/app.constants';
import { UserService } from 'src/app/services/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Period,
  PeriodFilterComponent,
  PRESET_DATES,
} from './period-filter.component';
import * as moment from 'moment';
import isEmpty from 'lodash-es/isEmpty';

const ANGULAR_MATERIAL_MODULES = [
  MatFormFieldModule,
  MatSelectModule,
  MatDatepickerModule,
];

describe('PeriodFilterComponent', () => {
  let component: PeriodFilterComponent;
  let fixture: ComponentFixture<PeriodFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeriodFilterComponent],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        ...ANGULAR_MATERIAL_MODULES,
      ],
      providers: [UserService, ConfigurationProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set start date and end date after preset date change (last 7 days)', () => {
    // change value of presetDate form control
    component.presetDate.setValue(PRESET_DATES.last7Days.value);
    component.updatePeriodAfterPresetDateChanges();

    // current values of form controls
    const defaultPresetDate = component.presetDate.value;
    const startDate = moment(component.startDate.value).format('YYYY-MM-DD');
    const endDate = moment(component.endDate.value).format('YYYY-MM-DD');

    // expected values
    const expectedDefaultPresetDate = PRESET_DATES.last7Days.value;
    const expectedStartDate = moment().subtract(7, 'd').format('YYYY-MM-DD');
    const expectedEndDate = moment().format('YYYY-MM-DD');

    expect(defaultPresetDate).toEqual(expectedDefaultPresetDate);
    expect(startDate).toEqual(expectedStartDate);
    expect(endDate).toEqual(expectedEndDate);
  });

  it('should set start date and end date after preset date change (last 15 days)', () => {
    // change value of presetDate form control
    component.presetDate.setValue(PRESET_DATES.last15Days.value);
    component.updatePeriodAfterPresetDateChanges();

    // current values of form controls
    const defaultPresetDate = component.presetDate.value;
    const startDate = moment(component.startDate.value).format('YYYY-MM-DD');
    const endDate = moment(component.endDate.value).format('YYYY-MM-DD');

    // expected values
    const expectedDefaultPresetDate = PRESET_DATES.last15Days.value;
    const expectedStartDate = moment().subtract(15, 'd').format('YYYY-MM-DD');
    const expectedEndDate = moment().format('YYYY-MM-DD');

    expect(defaultPresetDate).toEqual(expectedDefaultPresetDate);
    expect(startDate).toEqual(expectedStartDate);
    expect(endDate).toEqual(expectedEndDate);
  });

  it('should set start date and end date after preset date change (last 30 days)', () => {
    // change value of presetDate form control
    component.presetDate.setValue(PRESET_DATES.last30Days.value);
    component.updatePeriodAfterPresetDateChanges();

    // current values of form controls
    const defaultPresetDate = component.presetDate.value;
    const startDate = moment(component.startDate.value).format('YYYY-MM-DD');
    const endDate = moment(component.endDate.value).format('YYYY-MM-DD');

    // expected values
    const expectedDefaultPresetDate = PRESET_DATES.last30Days.value;
    const expectedStartDate = moment().subtract(30, 'd').format('YYYY-MM-DD');
    const expectedEndDate = moment().format('YYYY-MM-DD');

    expect(defaultPresetDate).toEqual(expectedDefaultPresetDate);
    expect(startDate).toEqual(expectedStartDate);
    expect(endDate).toEqual(expectedEndDate);
  });

  it('should clear start date and end date when preset date change (custom date range)', () => {
    // change value of presetDate form control
    component.presetDate.setValue(PRESET_DATES.custom.value);
    component.updatePeriodAfterPresetDateChanges();

    // current values of form controls
    const defaultPresetDate = component.presetDate.value;
    const startDate = component.startDate.value;
    const endDate = component.endDate.value;

    // expected values
    const expectedDefaultPresetDate = PRESET_DATES.custom.value;
    const expectedStartDate = null;
    const expectedEndDate = null;

    expect(defaultPresetDate).toEqual(expectedDefaultPresetDate);
    expect(startDate).toEqual(expectedStartDate);
    expect(endDate).toEqual(expectedEndDate);
  });

  it('should detect if there is form value changes comparing with previous value', fakeAsync(() => {
    // after initial load there isn't detected changes in form value
    const isThereAChangeInInit: boolean = component.isFormValueChange();

    const selectedPresetDate = component.presetDate.value;

    // get a different value of selectedPresetDate to simulate change
    let newPresetDate;
    const presetDates = Object.values(PRESET_DATES).filter(
      (i) => i.value !== selectedPresetDate
    );

    if (!isEmpty(presetDates)) {
      newPresetDate = presetDates[0].value;
    } else {
      newPresetDate = PRESET_DATES.custom.value;
    }

    // change value of presetDate form control
    component.presetDate.setValue(newPresetDate);
    // wait 5 millisenconds because formPresetDateSub subscription uses a debounce time of 5 milliseconds
    tick(5);
    const isThereAChangeAfterInit: boolean = component.isFormValueChange();

    expect(isThereAChangeInInit).toEqual(false);
    expect(isThereAChangeAfterInit).toEqual(true);
    discardPeriodicTasks();
  }));

  it('should convert selected dates to Period type', () => {
    // current values of form controls but parsed to moment date to create expected values
    const expectedStartDate = moment(component.startDate.value).format(
      'YYYY-MM-DD'
    );
    const expectedEndDate = moment(component.endDate.value).format(
      'YYYY-MM-DD'
    );

    const period: Period = component.getPeriod();

    expect(period.startDate).toEqual(expectedStartDate);
    expect(period.endDate).toEqual(expectedEndDate);
  });

  it('should parse dates of selected Period to UTC format', () => {
    const defaultPeriod = component.getPeriod();

    // use the user date to get the first and last hour of the day
    const today = moment();
    const startTime = today.startOf('day').format('HH:mm:ss');
    const endTime = today.endOf('day').format('HH:mm:ss');

    const startDateTime = moment(
      `${defaultPeriod.startDate} ${startTime}`,
      'YYYY-MM-DD HH:mm:ss'
    );
    const endDateTime = moment(
      `${defaultPeriod.endDate} ${endTime}`,
      'YYYY-MM-DD HH:mm:ss'
    );

    // create expected period
    const expectedPeriodInUTCFormat: Period = {
      startDate: moment.utc(startDateTime).format('YYYY-MM-DD'),
      endDate: moment.utc(endDateTime).format('YYYY-MM-DD'),
    };

    const periodInUTC: Period = component.getPeriodInUTCFormat();

    expect(periodInUTC.startDate).toEqual(expectedPeriodInUTCFormat.startDate);
    expect(periodInUTC.endDate).toEqual(expectedPeriodInUTCFormat.endDate);
  });

  it('shoud disable form when disabled input is true', () => {
    component.disabled = true;
    expect(component.form.disabled).toEqual(true);
  });

  it('shoud enable form when disabled input is false', () => {
    component.disabled = false;
    expect(component.form.disabled).toEqual(false);
  });

  it('shoud emit periodChange to parent component when preset date changes', fakeAsync(() => {
    // add spyOn to check if event emitter is sended to parent component
    spyOn(component.periodChange, 'emit');

    // change value of presetDate form control to custom
    component.presetDate.setValue(PRESET_DATES.custom.value);

    // wait 5 millisenconds because formPresetDateSub subscription uses a debounce time of 5 milliseconds
    tick(5);
    fixture.detectChanges();

    const newStartDate = moment().subtract(10, 'd').format('YYYY-MM-DD');
    const newEndDate = moment().format('YYYY-MM-DD');

    // change value for startDate and endDate form controls
    component.startDate.setValue(newStartDate);
    component.endDate.setValue(newEndDate);
    component.form.markAllAsTouched();

    // wait 5 millisenconds because formPeriodSub subscription uses a debounce time of 5 milliseconds
    tick(5);
    fixture.detectChanges();

    const periodInUTC: Period = component.getPeriodInUTCFormat();

    if (component.isFormValueChange() && component.form.valid) {
      expect(component.periodChange.emit).toHaveBeenCalledOnceWith(periodInUTC);
    } else if (!component.isFormValueChange() && !component.form.valid) {
      expect(component.periodChange.emit).toHaveBeenCalledTimes(0);
    } else if (component.form.valid) {
      expect(component.periodChange.emit).toHaveBeenCalledTimes(1);
    }
  }));
});
