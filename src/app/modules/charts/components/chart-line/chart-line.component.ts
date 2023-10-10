import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5locales_es_ES from '@amcharts/amcharts5/locales/es_ES';

import { REQ_STATUS } from 'src/app/constants/general';
import { isEmpty } from 'lodash-es';
import { getStringWithDecimals } from 'src/app/tools/functions/general';

@Component({
  selector: 'app-chart-line',
  templateUrl: './chart-line.component.html',
  styleUrls: ['./chart-line.component.scss'],
})
export class ChartLineComponent implements OnInit, AfterViewInit {
  @Input() dataStatus: number = REQ_STATUS.INITIAL;
  @Input() yAxisTitle: string;
  @Input() formatValue: string; // symbol in tooltip after numeric value in xAxis (USD, %)
  @Input() decimalInValues: number = 0; // number of decimals for values in chart
  @Input() emptyDataMsg: string = 'No se encontraron datos.';
  @Input() errorMsg: string;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-line-${this.name}`;
  }

  // ordered data by date property
  private _data: ChartLineData[] = [];
  get data() {
    return this._data;
  }
  @Input() set data(value) {
    this._data = value;
    if (this.chartSeries) {
      this.loadChartData(this.chartSeries);
    }
  }

  chartID: string;
  chartSeries;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.loadChart();
  }

  loadChart(): void {
    let root = am5.Root.new(this.chartID);

    root.setThemes([am5themes_Animated.new(root)]);

    root.locale = am5locales_es_ES;

    const decimals = getStringWithDecimals(this.decimalInValues);
    root.numberFormatter.set('numberFormat', `#,###${decimals}`);
    root.dateFormatter.set('dateFormat', 'dd-MM-yyyy');

    // root.dateFormatter.setAll({
    //   dateFormat: 'yyyy-MM-dd',
    //   dateFields: ['valueX'],
    // });

    // Create chart
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        pinchZoomX: true,
      })
    );

    // Add cursor
    let cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'none',
      })
    );
    cursor.lineY.set('visible', false);

    // Create axes
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: {
          timeUnit: 'day',
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    if (!!this.yAxisTitle) {
      yAxis.children.unshift(
        am5.Label.new(root, {
          rotation: -90,
          text: this.yAxisTitle,
          y: am5.p50,
          centerX: am5.p50,
        })
      );
    }

    xAxis.get('renderer').labels.template.setAll({
      fontSize: '0.75rem',
    });

    yAxis.get('renderer').labels.template.setAll({
      fontSize: '0.75rem',
    });

    // Add series
    let series = chart.series.push(
      am5xy.LineSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        valueXField: 'date',
        stroke: am5.color(0x05adb4),
        tooltip: am5.Tooltip.new(root, {
          labelText: `{valueY}${this.formatValue ? this.formatValue : ''}`,
        }),
      })
    );
    series.data.setAll(this.data);

    // Make stuff animate on load
    series.appear(1000);
    chart.appear(1000, 100);

    if (!this.dataStatus) {
      this.dataStatus = REQ_STATUS.SUCCESS;
    }

    this.loadChartData(series);
  }

  loadChartData(series) {
    this.chartSeries = series;
    series.data.setAll(this.data);
  }
}

export interface ChartLineData {
  date: string | Date | number;
  value: number;
}
