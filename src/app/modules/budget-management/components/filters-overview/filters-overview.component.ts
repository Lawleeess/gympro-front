import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { REQ_STATUS } from 'src/app/constants/general';
import { UserService } from 'src/app/services/user.service';
import { isEqual } from 'lodash-es';
import * as moment from 'moment';

@Component({
  selector: 'app-filters-overview',
  templateUrl: './filters-overview.component.html',
  styleUrls: ['./filters-overview.component.scss'],
})
export class FiltersOverviewComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter<OverviewFilters>();

  private _status: number = REQ_STATUS.INITIAL;
  @Input() set status(value: number) {
    this._status = value;

    if (value === REQ_STATUS.INITIAL || value === REQ_STATUS.LOADING) {
      this.form?.disable();
    } else {
      this.form?.enable();
    }
  }

  get status(): number {
    return this._status;
  }

  MONTHS: Month[] = [
    { id: 1, value: 'january', label: 'enero' },
    { id: 2, value: 'febrary', label: 'febrero' },
    { id: 3, value: 'march', label: 'marzo' },
    { id: 4, value: 'april', label: 'abril' },
    { id: 5, value: 'may', label: 'mayo' },
    { id: 6, value: 'june', label: 'junio' },
    { id: 7, value: 'july', label: 'julio' },
    { id: 8, value: 'august', label: 'agosto' },
    { id: 9, value: 'september', label: 'septiembre' },
    { id: 10, value: 'octuber', label: 'octubre' },
    { id: 11, value: 'movember', label: 'noviembre' },
    { id: 12, value: 'december', label: 'diciembre' },
  ];
  months: Month[] = [];
  years: number[];
  clients: object[];
  clientsReqStatus: number = REQ_STATUS.INITIAL;

  form: FormGroup;
  formMonthSub: Subscription;
  formYearSub: Subscription;

  currentYear: number;
  currentMonth: object;
  defaultClientOpt = { id: 'all', name: 'Todos' };
  selectedClient: any = this.defaultClientOpt;
  today = moment();

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.currentYear = Number(this.today.format('YYYYY'));
    const month = Number(this.today.format('MM'));

    this.months = this.MONTHS.filter((i) => i.id <= month);
    this.currentMonth = this.months.find((i) => i.id == month);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      year: [this.currentYear, Validators.required],
      month: [this.currentMonth, Validators.required],
      client: [this.defaultClientOpt.id, Validators.required],
    });

    this.years = this.getYears(2022);
    this.getClients();

    // initial emission
    this.handleChange();

    this.formMonthSub = this.form
      .get('month')
      .valueChanges.subscribe((month) => {
        if (!isEqual(this.form.value.month, month)) {
          this.handleChange();
        }
      });

    this.formYearSub = this.form.get('year').valueChanges.subscribe((year) => {
      if (!isEqual(this.form.value.year, year)) {
        this.getEnabledMonths(this.form.get('year').value);
        this.handleChange();
      }
    });
  }

  getYears(initialYear: number): number[] {
    const years: number[] = [];

    for (let i = this.currentYear; i >= initialYear; i--) {
      years.push(i);
    }

    return years;
  }

  getClients(): void {
    this.clientsReqStatus = REQ_STATUS.LOADING;
    this.userService.getClientsWithAccess().subscribe(
      (resp: any[]) => {
        this.clients = !!resp
          ? [{ ...this.defaultClientOpt }, ...resp]
          : [{ ...this.defaultClientOpt }];
        this.clientsReqStatus = REQ_STATUS.SUCCESS;
      },
      (error) => {
        console.error(error);
        this.clientsReqStatus = REQ_STATUS.ERROR;
      }
    );
  }

  getEnabledMonths(newYear: number) {
    const currentYear = this.today.year();

    if (newYear < currentYear) {
      this.months = [...this.MONTHS];
    } else if (newYear === currentYear) {
      const currentMonth = this.today.month() + 1;
      this.months = this.MONTHS.filter((i) => i.id <= currentMonth);

      const selectedMonth = this.form.get('month').value;
      if (!this.months.some((i) => i.id === selectedMonth.id)) {
        this.currentMonth = this.months.find((i) => i.id == currentMonth);
        this.form.get('month').setValue(this.currentMonth);
      }
    }
  }

  clientChange(client: any) {
    this.selectedClient = client;
    this.handleChange();
  }

  handleChange(): void {
    const filters: OverviewFilters = new OverviewFilters();
    filters.year = this.form.get('year').value;
    filters.month = this.form.get('month').value.id;

    if (this.selectedClient.id !== 'all') {
      filters.clientID = this.selectedClient.id;
      filters.clientName = this.selectedClient.name;
    }

    this.filterChange.emit(filters);
  }

  ngOnDestroy(): void {
    this.formMonthSub?.unsubscribe();
    this.formYearSub?.unsubscribe();
  }
}

interface Month {
  id: number;
  value: string;
  label: string;
}

export class OverviewFilters {
  clientID: string;
  clientName: string;
  year: number;
  month: number;
}
