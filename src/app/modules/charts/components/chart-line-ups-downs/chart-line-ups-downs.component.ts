import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { REQ_STATUS } from 'src/app/constants/general';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { getStringWithDecimals } from 'src/app/tools/functions/general';

@Component({
  selector: 'app-chart-line-ups-downs',
  templateUrl: './chart-line-ups-downs.component.html',
  styleUrls: ['./chart-line-ups-downs.component.scss'],
})
export class ChartLineUpsDownsComponent implements OnInit {
  @Input() heightPx: number = 350; // height property value valid in css
  @Input() dataStatus: number = REQ_STATUS.INITIAL;
  @Input() emptyDataMsg: string = 'No se encontraron datos.';
  @Input() errorMsg: string;
  @Input() decimalInValues: number = 0; // number of decimals for values in chart

  // @Input() name
  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-line-ups-downs-${this.name}`;
  }

  // @Input() data
  private _data: ChartLineUpsDownsData[] = [];
  get data() {
    return this._data;
  }
  @Input() set data(value) {
    this._data = value;
    if (!!this.root && !!this.series && !!this.sbSeries) {
      this.loadChartData(this.series, this.sbSeries);
    }
  }

  // @Input() tooltipSymbolBefore
  private _tooltipSymbolBefore: string;
  get tooltipSymbolBefore() {
    return this._tooltipSymbolBefore;
  }
  @Input() set tooltipSymbolBefore(value) {
    this._tooltipSymbolBefore = value;
    if (!!this.root && !!this.series && !!this.sbSeries) {
      this.loadTooltips();
    }
  }

  // @Input() tooltipSymbolAfter
  private _tooltipSymbolAfter: string;
  get tooltipSymbolAfter() {
    return this._tooltipSymbolAfter;
  }
  @Input() set tooltipSymbolAfter(value) {
    this._tooltipSymbolAfter = value;
    if (!!this.root && !!this.series && !!this.sbSeries) {
      this.loadTooltips();
    }
  }

  chartID: string;
  root: am5.Root;
  series: am5xy.LineSeries;
  sbSeries: am5xy.LineSeries;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.loadChart();
    this.cdRef.detectChanges();
  }

  loadChart(): void {
    this.root = am5.Root.new(this.chartID);
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    const decimals = getStringWithDecimals(this.decimalInValues);
    this.root.numberFormatter.set('numberFormat', `#,###${decimals}`);
    this.root.dateFormatter.set('dateFormat', 'dd-MM-yyyy');

    let chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        pinchZoomX: true,
      })
    );

    // Add cursor
    chart.set(
      'cursor',
      am5xy.XYCursor.new(this.root, {
        behavior: 'none',
      })
    );

    // Create axes
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(this.root, {
        baseInterval: { timeUnit: 'day', count: 1 },
        renderer: am5xy.AxisRendererX.new(this.root, {}),
        tooltip: am5.Tooltip.new(this.root, {}),
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {}),
      })
    );

    xAxis.get('renderer').labels.template.setAll({
      fontSize: '0.75rem',
    });

    yAxis.get('renderer').labels.template.setAll({
      fontSize: '0.75rem',
    });

    // Add series
    let series = chart.series.push(
      am5xy.LineSeries.new(this.root, {
        name: 'Series',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        valueXField: 'date',
      })
    );

    series.strokes.template.set('templateField', 'strokeSettings');

    // Add scrollbar
    let scrollbar = chart.set(
      'scrollbarX',
      am5xy.XYChartScrollbar.new(this.root, {
        orientation: 'horizontal',
        height: 60,
      })
    );

    let sbDateAxis = scrollbar.chart.xAxes.push(
      am5xy.DateAxis.new(this.root, {
        baseInterval: {
          timeUnit: 'day',
          count: 1,
        },
        renderer: am5xy.AxisRendererX.new(this.root, {}),
      })
    );

    let sbValueAxis = scrollbar.chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {}),
      })
    );

    let sbSeries = scrollbar.chart.series.push(
      am5xy.LineSeries.new(this.root, {
        valueYField: 'value',
        valueXField: 'date',
        xAxis: sbDateAxis,
        yAxis: sbValueAxis,
      })
    );

    // Generate and set data
    this.loadChartData(series, sbSeries);

    // Make stuff animate on
    series.appear(1000);
    chart.appear(1000, 100);

    if (this.dataStatus === REQ_STATUS.INITIAL) {
      this.dataStatus = REQ_STATUS.SUCCESS;
    }
  }

  loadChartData(series: am5xy.LineSeries, sbSeries: am5xy.LineSeries): void {
    let downColor = am5.color('#c72333');
    let upColor = am5.color('#05adb4');
    let color;
    let previousColor;
    let previousDataObj;

    let data = generateDatas(this.data);

    function generateData(currentData, previousValue) {
      if (currentData.value >= previousValue) {
        color = upColor;
      } else {
        color = downColor;
      }

      let dataObj = {
        date: currentData.date,
        value: currentData.value,
        color: color,
      }; // color will be used for tooltip background

      // only if changed
      if (color != previousColor) {
        if (!previousDataObj) {
          previousDataObj = dataObj;
        }
        previousDataObj.strokeSettings = { stroke: color };
      }

      previousDataObj = dataObj;
      previousColor = color;

      return dataObj;
    }

    function generateDatas(providedData) {
      let data = [];
      for (var i = 0; i < providedData.length; ++i) {
        const previousValue = i === 0 ? undefined : providedData[i - 1]?.value;
        data.push(generateData(providedData[i], previousValue));
      }
      return data;
    }

    series.data.setAll(data);
    sbSeries.data.setAll(data);

    this.series = series;
    this.sbSeries = sbSeries;

    this.loadTooltips();
  }

  loadTooltips() {
    let tooltip = this.series.set(
      'tooltip',
      am5.Tooltip.new(this.root, {
        labelText: `${
          !!this.tooltipSymbolBefore ? `${this.tooltipSymbolBefore}` : ``
        } {valueY} ${
          !!this.tooltipSymbolAfter ? `${this.tooltipSymbolAfter}` : ``
        }`,
      })
    );

    // this is added in ored adapter to be triggered each time position changes
    tooltip.on('pointTo', function () {
      let background = tooltip.get('background');
      background.set('fill', background.get('fill'));
    });

    // tooltip bacground takes color from data item
    tooltip.get('background').adapters.add('fill', function (fill) {
      if (tooltip.dataItem) {
        return tooltip.dataItem.dataContext['color'];
      }
      return fill;
    });
  }
}
export interface ChartLineUpsDownsData {
  date: number; // date in miliseconds
  value: number;
}
