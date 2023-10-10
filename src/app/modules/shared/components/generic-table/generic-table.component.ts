import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { isEqual } from 'lodash-es';
import { ValueFormat } from 'src/app/tools/types/global';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
})
export class GenericTableComponent implements OnInit, AfterViewInit {
  @Input() tableTitle: string;
  @Input() errorMsg = 'Error al consultar datos';
  @Input() emptyDataMsg = 'No se encontraron datos';
  @Input() colSortedByDefault: { name: string; sortDirection: 'asc' | 'desc' }; // name property refers column name (TableColumn)
  @Input() searchFilter: boolean = true; // to show or not search filter
  @Input() editionMode: 'cell' | 'row' = 'row'; // to show or not search filter
  @Input() minHeightVh: number;

  private _displayedColumns: TableColumn[];
  get displayedColumns() {
    return this._displayedColumns;
  }

  @Input() set displayedColumns(value) {
    this._displayedColumns = value;
    this.displayedColumnsHeaders = this.displayedColumns?.map(
      (item) => item.name
    );
  }

  private _tableData: any; // object with any properties but "data" and "reqStatus" are required
  get tableData() {
    return this._tableData;
  }

  @Input() set tableData(value) {
    this._tableData = value;
    this.dataSource = new MatTableDataSource<any>(this.tableData?.data);
    this.dataSource.sort = this.sort;
  }

  @Input() set tableDataChange(value) {
    this.tableData.data = value;
    this.dataSource = new MatTableDataSource<any>(this.tableData?.data);
    this.dataSource.sort = this.sort;
    this.loadPaginator();
  }

  @Output() selectedRowChange = new EventEmitter<any>(); // after selection
  @Output() rowChange = new EventEmitter<any>(); // after row edition when editionMode = 'row'
  @Output() cellChange = new EventEmitter<any>(); // after cell edition when editionMode = 'cell'

  dataSource = new MatTableDataSource<any>();
  displayedColumnsHeaders;
  enableEdition: boolean;

  selectedElement: any;
  editedElement: any; // original element (item shown in table)
  auxEditedElement: any; // element after changes (item emitted to the parent component)

  editedColumn: string; // column name reference selected to edition

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  myMath = Math;

  constructor() {}

  ngOnInit(): void {
    this.loadPaginator();
  }

  ngAfterViewInit(): void {
    this.loadPaginator();
    this.dataSource.sort = this.sort;
  }

  loadPaginator(): void {
    if (!!this.paginator) {
      this.dataSource.paginator = this.paginator;

      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.nextPageLabel = 'Siguiente';
      this.paginator._intl.previousPageLabel = 'Anterior';
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';

      this.paginator._intl.getRangeLabel = (
        page: number,
        pageSize: number,
        length: number
      ) => {
        if (length === 0 || pageSize === 0) {
          return `0 de`;
        }

        length = Math.max(length, 0);

        const startIndex = page * pageSize;

        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex =
          startIndex < length
            ? Math.min(startIndex + pageSize, length)
            : startIndex + pageSize;

        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
    }
  }

  // **
  // START LOGIC TO LOAD MEDIA COLUMNS OF TYPE TableMediaColumn.indicator
  // **

  /**
   * Returns the validation of IndicatorSettings type
   * in which all properties of this type must be present in column object
   * @param column IndicatorSettings object
   * @returns validation result
   */
  isIndicatorColumnValid(column: IndicatorSettings): boolean {
    return (
      column?.targetValue !== undefined &&
      column?.currentValue != undefined &&
      column?.triggerMarginValue != undefined &&
      column?.targetValue !== null &&
      column?.currentValue !== null &&
      column?.triggerMarginValue !== null
    );
  }

  /**
   * Returns a string concated all given params
   * in which all properties of this type must be present in column object
   * @param indicatorValue value that is concatenated
   * @param indicatorTooltipPrefix string value concatenated before indicatorValue
   * @param indicatorTooltipSuffix string after concatenated before indicatorValue
   * @returns concatenated string
   */
  loadTooltipValueForIndicatorColumn(
    indicatorValue: number,
    indicatorTooltipPrefix?: string,
    indicatorTooltipSuffix?: string
  ): string {
    if (!!indicatorTooltipPrefix && !!indicatorTooltipSuffix) {
      return indicatorTooltipPrefix + indicatorValue + indicatorTooltipSuffix;
    } else if (!!indicatorTooltipPrefix) {
      return indicatorTooltipPrefix + indicatorValue;
    } else if (!!indicatorTooltipSuffix) {
      return indicatorValue + indicatorTooltipSuffix;
    } else {
      return indicatorValue.toString();
    }
  }

  /**
   * Returns the real indicator column value using a rule of three
   * @param column IndicatorSettings object
   * @returns percentage value
   */
  getIndicatorColumnValue(column: IndicatorSettings): number {
    if (column.currentValue > column.targetValue) {
      return 100;
    }

    return (column.currentValue * 100) / column.targetValue;
  }

  /**
   * Returns if indicator column value is out of its set margin
   * @param column IndicatorSettings object
   * @returns validation result
   */
  isIndicatorColumnOutOfMargin(column: IndicatorSettings): boolean {
    // Apply rule of three to get the percentage (the real percentage score)
    // if the real percentage is greater than the preset margin the indicator is out of margin
    const maxPercentage = 100;
    const realPercentage =
      (column.currentValue * maxPercentage) / column.targetValue;
    const percentageDiff = maxPercentage - realPercentage;

    return percentageDiff > column.triggerMarginValue;
  }
  // **
  // END LOGIC TO LOAD MEDIA COLUMNS OF TYPE TableMediaColumn.indicator
  // **

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectRow(row: object, columnName: string): void {
    this.selectedElement = row;
    const selection: selectedCell = {
      row,
      columnName,
    };
    this.selectedRowChange.emit(selection);
  }

  columnValueChange(row: any, column: string, value: any): void {
    const formatedValue =
      typeof this.editedElement[column] === 'number' && +value;

    if (!this.selectedElement || this.selectedElement.id !== row.id) {
      this.auxEditedElement = { ...this.editedElement };
    } else {
      this.auxEditedElement = this.auxEditedElement
        ? { ...this.auxEditedElement }
        : { ...this.editedElement };
    }

    this.auxEditedElement[column] = formatedValue;
    this.selectedElement = row;
  }

  updateRow(): void {
    if (!this.auxEditedElement) {
      return;
    }

    if (!isEqual(this.editedElement, this.auxEditedElement)) {
      this.rowChange.emit(this.auxEditedElement);
    }
  }

  updateCell(): void {
    if (!this.auxEditedElement) {
      return;
    }

    const changes: UpdatedCell = {
      updatedItem: this.auxEditedElement,
      updatedProperty: this.editedColumn,
    };

    if (!isEqual(this.editedElement, this.auxEditedElement)) {
      this.cellChange.emit(changes);
      this.selectedElement = null;
    }
  }
}

export interface TableColumn {
  name: string; // object property to show in column
  title?: string; // object property title for column header
  textAlign?: 'left' | 'right' | 'center'; // valid css property
  textPipe?: 'titlecase' | 'lowercase' | 'uppercase';
  formatValue?: ValueFormat; // to applie pipes
  decimalInValues?: number; //number of decimals when formatValue is equal to 'currency', 'decimal' or 'percentage'
  widthColumn?: number; // width (in rem) property for column td
  maxWidthColumn?: number; // max-width (in vw) property for column (td)
  tooltip?: boolean; // to show the value (name property) on tooltip in hover
  tooltipPropertyName?: string; // to show the value (another name property) on tooltip in hover
  droptipPropertyName?: string; // to show the value (of specific name property) on tooltip in hover
  emptyLine?: boolean; // to show a "-" when there isn't data
  icon?: string; // valid css class reference to <i></i> emit selectedRowChange with click event
  button?: boolean; // emit selectedRowChange with click event
  link?: boolean; // to show content column as <a></a> and redirect to link object property
  linkName?: string; // copy displayed in column to redirect to link property
  linkEmpty?: string; // copy displayed in empty link column
  status?: boolean; // use status property in objects (running | fail | finished) and show a special icon/spinner
  media?: TableMediaColumn;
  sortingDisabled?: boolean; // to disable sort functionality
  editable?: boolean; // editable field
  editTrigger?: boolean; // enable edition after click in this column item
  chartLineSettings?: ChartLineColumnSettings; // applies only when media property is equals to 'chart-line'
  indicatorTooltipPrefix?: string; // applies only when media property is equals to 'indicator' put the string before indicator.currentValue
  indicatorTooltipSuffix?: string; // applies only when media property is equals to 'indicator' put the string after indicator.currentValue
}

export enum TableMediaColumn {
  'iconify-icon' = 'iconify-icon',
  'progress-bar' = 'progress-bar',
  'chart-line' = 'chart-line',
  increment = 'increment',
  indicator = 'indicator',
}

export class ChartLineColumnSettings {
  dateRefName: string; // property name in array objects which represents 'date' (x Axis)
  valueRefName: string; // property name in array objects which represents 'value' (y Axis)
}

export class TableRow {
  [key: string]:
    | string
    | number
    | boolean
    | IconifySettings
    | IncrementSettings
    | IndicatorSettings
    | ChartLineData[];
}

export class IconifySettings {
  dataIcon: string;
}

export class IncrementSettings {
  previousValue: number;
  newValue: number;
  valueFormat?: ValueFormat;
}

// IndicatorSettings shows the percentage equivalent of currentValue with respect to the TargetValue
// and this value is shown in red color if the difference between the current percentage is greater
// than triggerMarginValue (a a preset margin)
export class IndicatorSettings {
  targetValue: number;
  currentValue: number;
  triggerMarginValue: number;
}

export class ChartLineData {
  [key: string]: string | number; // object array with date and value references which match with dateRefName and valueRefName of ChartLineColumnSettings
}

export interface selectedCell {
  row: object;
  columnName: string;
}

export interface UpdatedCell {
  updatedItem: object;
  updatedProperty: string;
}
