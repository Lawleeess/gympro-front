import { ViewModeItem } from '../modules/shared/components/view-mode-selector/view-mode-selector.component';

export const REQ_STATUS = {
  INITIAL: 0,
  LOADING: 1,
  SUCCESS: 2,
  ERROR: 3,
};

export const VIEW_MODES: ViewModeItem[] = [
  {
    mode: 'table',
    label: 'Tabla',
    icon: 'fas fa-table',
  },
  {
    mode: 'cards',
    label: 'Tarjetas',
    icon: 'fas fa-th-large',
  },
];

export const DATE_PICKER_FORMAT = {
  parse: {
    dateInput: ['YYYY-MM-DD'],
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
