import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { REQ_STATUS } from 'src/app/constants/general';
import { By } from '@angular/platform-browser';
import {
  GenericTableComponent,
  IndicatorSettings,
  TableColumn,
  TableMediaColumn,
} from './generic-table.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

const ANGULAR_MATERIAL_MODULES = [
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
];

describe('GenericTableComponent', () => {
  let component: GenericTableComponent;
  let fixture: ComponentFixture<GenericTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenericTableComponent],
      imports: [BrowserAnimationsModule, ...ANGULAR_MATERIAL_MODULES],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should load columns of type indicator', () => {
    const mockedTableColumns: TableColumn[] = [
      {
        name: 'auditTargetValue',
        title: 'Calificación',
        media: TableMediaColumn.indicator,
      },
    ];

    const mockedData = [
      {
        auditTargetValue: {
          currentValue: 65,
          targetValue: 100,
          triggerMarginValue: 40,
        },
      },
    ];

    const mockedReqStatus: number = REQ_STATUS.SUCCESS;

    component.displayedColumns = mockedTableColumns;
    component.tableData = { data: mockedData, reqStatus: mockedReqStatus };
    fixture.detectChanges();
    const firstColumn: HTMLElement = fixture.debugElement.query(
      By.css('td')
    )?.nativeElement;

    const firstColumnValue = Number(firstColumn.innerText);
    const expectedColumnValue = mockedData[0].auditTargetValue.currentValue;
    expect(firstColumnValue).toEqual(expectedColumnValue);
  });

  it('should load errors when indicator column value is invalid', () => {
    const mockedTableColumns: TableColumn[] = [
      {
        name: 'auditTargetValue',
        title: 'Calificación',
        media: TableMediaColumn.indicator,
      },
    ];

    const mockedData = [
      {
        auditTargetValue: {
          currentValue: 65,
          targetValue: 100,
          triggerMarginValue: null,
        },
      },
    ];

    const mockedReqStatus: number = REQ_STATUS.SUCCESS;

    component.displayedColumns = mockedTableColumns;
    component.tableData = { data: mockedData, reqStatus: mockedReqStatus };
    fixture.detectChanges();
    const firstColumn: HTMLElement = fixture.debugElement.query(
      By.css('td')
    )?.nativeElement;

    const firstColumnValue = firstColumn.innerText;
    const expectedColumnValue = 'invalid indicator properties';
    expect(firstColumnValue).toEqual(expectedColumnValue);
  });

  it('should returns if an idicator column type is valid', () => {
    const column: IndicatorSettings = {
      currentValue: 65,
      targetValue: 100,
      triggerMarginValue: 40,
    };

    const isIndicatorValid = component.isIndicatorColumnValid(column);
    expect(isIndicatorValid).toEqual(true);
  });

  it('should returns if an idicator column type is invalid', () => {
    const column: IndicatorSettings = {
      currentValue: 65,
      targetValue: null,
      triggerMarginValue: null,
    };

    const isIndicatorValid = component.isIndicatorColumnValid(column);
    expect(isIndicatorValid).toEqual(false);
  });

  it('should get the real percentage value of indicator', () => {
    const column: IndicatorSettings = {
      currentValue: 97,
      targetValue: 40,
      triggerMarginValue: 40,
    };

    // indicator value is 100% by default because currentValue
    // is greater than targetValue
    const isIndicatorValue = component.getIndicatorColumnValue(column);
    expect(isIndicatorValue).toEqual(100);
  });

  it('should get the real percentage value of indicator - 2', () => {
    const column: IndicatorSettings = {
      currentValue: 35,
      targetValue: 75,
      triggerMarginValue: 40,
    };

    // it's necessary to apply a rule of three to get the real value of currentValue in percentage
    const isIndicatorValue = Math.round(
      component.getIndicatorColumnValue(column)
    );
    expect(isIndicatorValue).toEqual(47);
  });

  it('should load tooltip text for indicator', () => {
    const indicatorValue: number = 50;
    const indicatorTooltipPrefix: string = null;
    const indicatorTooltipSuffix: string = null;

    const tooltipValue = component.loadTooltipValueForIndicatorColumn(
      indicatorValue,
      indicatorTooltipPrefix,
      indicatorTooltipSuffix
    );
    const expectedValue = indicatorValue.toString();
    expect(tooltipValue).toEqual(expectedValue);
  });

  it('should load tooltip text for indicator (prefix)', () => {
    const indicatorValue: number = 50;
    const indicatorTooltipPrefix: string = 'Calificación objetivo: ';
    const indicatorTooltipSuffix: string = null;

    const tooltipValue = component.loadTooltipValueForIndicatorColumn(
      indicatorValue,
      indicatorTooltipPrefix,
      indicatorTooltipSuffix
    );
    const expectedValue = indicatorTooltipPrefix + indicatorValue;
    expect(tooltipValue).toEqual(expectedValue);
  });

  it('should load tooltip text for indicator (suffix)', () => {
    const indicatorValue: number = 50;
    const indicatorTooltipPrefix: string = null;
    const indicatorTooltipSuffix: string = '%';

    const tooltipValue = component.loadTooltipValueForIndicatorColumn(
      indicatorValue,
      indicatorTooltipPrefix,
      indicatorTooltipSuffix
    );
    const expectedValue = indicatorValue + indicatorTooltipSuffix;
    expect(tooltipValue).toEqual(expectedValue);
  });

  it('should load tooltip text for indicator (prefix, suffix)', () => {
    const indicatorValue: number = 50;
    const indicatorTooltipPrefix: string = 'Calificación objetivo: ';
    const indicatorTooltipSuffix: string = '%';

    const tooltipValue = component.loadTooltipValueForIndicatorColumn(
      indicatorValue,
      indicatorTooltipPrefix,
      indicatorTooltipSuffix
    );
    const expectedValue =
      indicatorTooltipPrefix + indicatorValue + indicatorTooltipSuffix;
    expect(tooltipValue).toEqual(expectedValue);
  });

  it('should load indicator column when its value is in the set margin', () => {
    const column: IndicatorSettings = {
      currentValue: 65,
      targetValue: 100,
      triggerMarginValue: 40,
    };
    const isIndicatorColumnOutOfMargin =
      component.isIndicatorColumnOutOfMargin(column);

    expect(isIndicatorColumnOutOfMargin).toEqual(false);
  });

  it('should load indicator column when its value is in the set margin - 2', () => {
    const column: IndicatorSettings = {
      currentValue: 97,
      targetValue: 40,
      triggerMarginValue: 40,
    };
    const isIndicatorColumnOutOfMargin =
      component.isIndicatorColumnOutOfMargin(column);

    expect(isIndicatorColumnOutOfMargin).toEqual(false);
  });

  it('should load indicator column when its value is out of the set margin', () => {
    const column: IndicatorSettings = {
      currentValue: 35,
      targetValue: 75,
      triggerMarginValue: 40,
    };
    const isIndicatorColumnOutOfMargin =
      component.isIndicatorColumnOutOfMargin(column);

    expect(isIndicatorColumnOutOfMargin).toEqual(true);
  });
});
