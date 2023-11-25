import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { REQ_STATUS } from 'src/app/constants/general';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-chart-sorted-bar',
  templateUrl: './chart-sorted-bar.component.html',
  styleUrls: ['./chart-sorted-bar.component.scss'],
})
export class ChartSortedBarComponent implements OnInit {
  @Input() category: string = 'category';
  @Input() value: string = 'value';
  @Input() heightPx: number = 350; // height property value valid in css
  @Input() heightOverflow: boolean = false;
  @Input() dataStatus: number = REQ_STATUS.INITIAL;
  @Input() emptyDataMsg: string = 'No se encontraron datos.';
  @Input() errorMsg: string;

  // @Input() name
  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-donut-${this.name}`;
  }

  // @Input() data
  private _data: any[] = [];
  get data() {
    return this._data;
  }
  @Input() set data(value) {
    this._data = value;
    if (!!this.yAxis && !!this.series) {
      this.loadChartData(this.yAxis, this.series);
    }
  }

  chartID: string;
  root: am5.Root;
  heightOverflowPx: number;
  chart: am5xy.XYChart;
  series: am5xy.ColumnSeries;
  yAxis: am5xy.CategoryAxis<am5xy.AxisRenderer>;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.loadChart();
    this.cdRef.detectChanges();
  }

  loadChart(): void {
    this.root = am5.Root.new(this.chartID);
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    // Create chart
    let chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
      })
    );

    chart.zoomOutButton.set('forceHidden', true);

    // Create axes
    let yRenderer = am5xy.AxisRendererY.new(this.root, {
      minGridDistance: 10,
    });

    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: this.category,
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(this.root, {}),
      })
    );

    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(this.root, {
        min: 0,
        renderer: am5xy.AxisRendererX.new(this.root, {}),
      })
    );

    yAxis.get('renderer').labels.template.setAll({
      fontSize: '0.75rem',
      oversizedBehavior: 'truncate',
      maxWidth: 130,
    });

    xAxis.get('renderer').labels.template.setAll({
      fontSize: '0.75rem',
    });

    // Add series
    let series = chart.series.push(
      am5xy.ColumnSeries.new(this.root, {
        name: 'Series 1',
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: this.value,
        categoryYField: this.category,
        tooltip: am5.Tooltip.new(this.root, {
          pointerOrientation: 'left',
          labelText: `{valueX.formatNumber('#,###.##')}`,
        }),
      })
    );

    // Rounded corners for columns
    series.columns.template.setAll({
      cornerRadiusTR: 5,
      cornerRadiusBR: 5,
      opacity: 0.9,
    });

    // Make each column to be of a different color
    series.columns.template.adapters.add('fill', function (fill, target) {
      return chart.get('colors').getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add('stroke', function (stroke, target) {
      return chart.get('colors').getIndex(series.columns.indexOf(target));
    });

    // Set data
    this.loadChartData(yAxis, series);

    chart.set(
      'cursor',
      am5xy.XYCursor.new(this.root, {
        behavior: 'none',
        xAxis: xAxis,
        yAxis: yAxis,
      })
    );

    series.appear(1000);
    chart.appear(1000, 100);

    if (this.dataStatus === REQ_STATUS.INITIAL) {
      this.dataStatus = REQ_STATUS.SUCCESS;
    }
  }

  sortCategoryAxis() {
    // Sort by value
    this.series.dataItems.sort((x, y) => {
      return x.get('valueX') - y.get('valueX'); // descending
      //return y.get("valueY") - x.get("valueX"); // ascending
    });

    // Go through each axis item
    am5.array.each(this.yAxis.dataItems, (dataItem) => {
      // get corresponding series item
      let seriesDataItem = this.getSeriesItem(dataItem.get('category'));

      if (seriesDataItem) {
        // get index of series data item
        let index = this.series.dataItems.indexOf(seriesDataItem);
        // calculate delta position
        let deltaPosition =
          (index - dataItem.get('index', 0)) / this.series.dataItems.length;
        // set index to be the same as series data item index
        dataItem.set('index', index);
        // set deltaPosition instanlty
        dataItem.set('deltaPosition', -deltaPosition);
        // animate delta position to 0
        dataItem.animate({
          key: 'deltaPosition',
          to: 0,
          duration: 1000,
          easing: am5.ease.out(am5.ease.cubic),
        });
      }
    });
    // Sort axis items by index.
    // This changes the order instantly, but as deltaPosition is set,
    // they keep in the same places and then animate to true positions.
    this.yAxis.dataItems.sort(function (x, y) {
      return x.get('index') - y.get('index');
    });
  }

  getSeriesItem(category) {
    for (var i = 0; i < this.series.dataItems.length; i++) {
      let dataItem = this.series.dataItems[i];
      if (dataItem.get('categoryY') == category) {
        return dataItem;
      }
    }
  }

  loadChartData(yAxis, series): void {
    if (this.heightOverflow) {
      this.getOverflowHeight();
    }

    this.yAxis = yAxis;
    this.series = series;
    yAxis.data.setAll(this.data);
    series.data.setAll(this.data);
    this.sortCategoryAxis();
  }

  getOverflowHeight() {
    const baseHeight = this.heightPx;
    const d = Math.floor(this.data.length / 5.5);
    this.heightOverflowPx = baseHeight * d;
  }
}
