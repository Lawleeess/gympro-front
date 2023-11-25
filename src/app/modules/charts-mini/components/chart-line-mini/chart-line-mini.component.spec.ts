import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartLineMiniComponent } from './chart-line-mini.component';

describe('ChartLineMiniComponent', () => {
  let component: ChartLineMiniComponent;
  let fixture: ComponentFixture<ChartLineMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartLineMiniComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartLineMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should parse data for chart configuration', () => {
    const mockData: any[] = [
      {
        date: '2022-06-07',
        value: 75,
      },
      {
        date: '2022-06-08',
        value: 74,
      },
      {
        date: '2022-06-10',
        value: 74,
      },
      {
        date: '2022-06-11',
        value: 83,
      },
    ];

    const expectedLabels: string[] = mockData.map((i) => i.date);
    const expectedData: number[] = mockData.map((i) => i.value);

    const { labels, data } = component.parseDataForChat(mockData);

    expect(labels).toEqual(expectedLabels);
    expect(data).toEqual(expectedData);
  });

  it('should parse data for chart configuration when data is null', () => {
    const mockData: any[] = null;

    const expectedLabels: string[] = [];
    const expectedData: number[] = [];

    const { labels, data } = component.parseDataForChat(mockData);

    expect(labels).toEqual(expectedLabels);
    expect(expectedData).toEqual(data);
  });

  it('should parse data for chart configuration when data is an empty array', () => {
    const mockData: any[] = [];

    const expectedLabels: string[] = [];
    const expectedData: number[] = [];

    const { labels, data } = component.parseDataForChat(mockData);

    expect(labels).toEqual(expectedLabels);
    expect(data).toEqual(expectedData);
  });

  it('should round data values by default', () => {
    const mockData: any[] = [
      {
        date: '2022-06-07',
        value: 75.7541,
      },
      {
        date: '2022-06-08',
        value: 74.2311,
      },
      {
        date: '2022-06-10',
        value: 74.6777,
      },
      {
        date: '2022-06-11',
        value: 83.1001,
      },
    ];

    const expectedLabels: string[] = mockData.map((i) => i.date);
    const expectedData: number[] = mockData.map((i) => Math.round(i.value));

    const { labels, data } = component.parseDataForChat(mockData);
    const parsedData = component.parsedDataWithValueFormat(data);

    expect(labels).toEqual(expectedLabels);
    expect(parsedData).toEqual(expectedData);
  });

  it('should use the indicated number of decimals to data values', () => {
    component.decimalInValues = 2;
    const mockData: any[] = [
      {
        date: '2022-06-07',
        value: 75.7541,
      },
      {
        date: '2022-06-08',
        value: 74.2311,
      },
      {
        date: '2022-06-10',
        value: 74.6777,
      },
      {
        date: '2022-06-11',
        value: 83.1001,
      },
    ];

    const expectedLabels: string[] = mockData.map((i) => i.date);
    const expectedData: number[] = [75.75, 74.23, 74.68, 83.1];

    const { labels, data } = component.parseDataForChat(mockData);
    const parsedData = component.parsedDataWithValueFormat(data);

    expect(labels).toEqual(expectedLabels);
    expect(parsedData).toEqual(expectedData);
  });

  it('should parse data for objects with different keys to date and value', () => {
    const mockData: any[] = [
      {
        datetime: '2022-06-07T10:00:05.956163Z',
        globalScore: 75,
      },
      {
        datetime: '2022-06-08T10:00:05.075264Z',
        globalScore: 74,
      },
      {
        datetime: '2022-06-10T10:00:05.420327Z',
        globalScore: 74,
      },
      {
        datetime: '2022-06-11T10:00:05.884502Z',
        globalScore: 83,
      },
    ];

    // assign values to the following component inputs
    component.categoryName = 'datetime';
    component.valueName = 'globalScore';
    component.data = mockData;
    fixture.detectChanges();

    const expectedLabels: string[] = mockData.map(
      (i) => i[component.categoryName]
    );
    const expectedData: number[] = mockData.map((i) => i[component.valueName]);

    const { labels, data } = component.parseDataForChat(mockData);

    expect(labels).toEqual(expectedLabels);
    expect(data).toEqual(expectedData);
  });

  it('should update data for chart configuration', () => {
    const mockData: any[] = [
      {
        datetime: '2022-06-07T10:00:05.956163Z',
        globalScore: 75,
      },
      {
        datetime: '2022-06-08T10:00:05.075264Z',
        globalScore: 74,
      },
      {
        datetime: '2022-06-10T10:00:05.420327Z',
        globalScore: 74,
      },
      {
        datetime: '2022-06-11T10:00:05.884502Z',
        globalScore: 83,
      },
    ];

    // assign values to the following component inputs
    component.categoryName = 'datetime';
    component.valueName = 'globalScore';
    component.data = mockData;
    fixture.detectChanges();

    const expectedLabels: string[] = mockData.map(
      (i) => i[component.categoryName]
    );
    const expectedData: number[] = mockData.map((i) => i[component.valueName]);

    const { labels, data } = component.parseDataForChat(mockData);
    component.updateChartDataForChat(labels, data);

    expect(labels).toEqual(expectedLabels);
    expect(data).toEqual(expectedData);
    expect(component.lineChartData.labels).toEqual(expectedLabels);
    expect(component.lineChartData.datasets[0].data).toEqual(expectedData);
  });
});
