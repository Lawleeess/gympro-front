import { Component, Input, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { REQ_STATUS } from 'src/app/constants/general';

@Component({
  selector: 'app-chart-line-series',
  templateUrl: './chart-line-series.component.html',
  styleUrls: ['./chart-line-series.component.scss'],
})
export class ChartLineSeriesComponent implements OnInit {
  @Input() dataStatus: number = REQ_STATUS.INITIAL;
  @Input() yAxisTitle: string;
  @Input() formatValue: string;
  @Input() errorMsg: string;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-line-series-${this.name}`;
  }

  private _series: ChartLineSerie[] = [];
  get series() {
    return this._series;
  }
  @Input() set series(value) {
    this._series = value;
    if (value.length > 0) {
      this.loadChart();
    }
  }

  chartID: string;

  constructor() {}

  ngOnInit(): void {}

  loadChart(): void {
    let root = am5.Root.new(this.chartID);

    root.setThemes([am5themes_Animated.new(root)]);

    root.dateFormatter.setAll({
      dateFormat: 'MMM dt, yyyy',
      dateFields: ['valueX'],
    });

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        maxTooltipDistance: 0,
        pinchZoomX: true,
      })
    );

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
    for (var i = 0; i < this.series.length; i++) {
      var series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: this.series[i].serie,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: 'value',
          valueXField: 'date',
          legendValueText: `{valueY} ${
            this.formatValue ? `${this.formatValue}` : ''
          }`,
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: 'horizontal',
            labelText: `{valueY} ${
              this.formatValue ? `${this.formatValue}` : ''
            }`,
          }),
        })
      );
      series.strokes.template.setAll({
        strokeWidth: 2,
      });
      series.data.setAll(this.series[i].data);

      // Make stuff animate on load
      series.appear();
    }

    // Add cursor
    var cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'none',
      })
    );
    cursor.lineY.set('visible', false);

    // Add legend
    var legend = chart.topAxesContainer.children.push(
      am5.Legend.new(root, {
        layout: root.horizontalLayout,
        width: 450,
        marginBottom: 20,
        x: am5.percent(50),
        centerX: am5.percent(50),
      })
    );

    // When legend item container is hovered, dim all the series except the hovered one
    legend.itemContainers.template.events.on('pointerover', (e) => {
      var itemContainer = e.target;

      // As series list is data of a legend, dataContext is series
      var series = itemContainer.dataItem.dataContext;

      chart.series.each((chartSeries: any) => {
        if (chartSeries != series) {
          chartSeries.strokes.template.setAll({
            strokeOpacity: 0.15,
            stroke: am5.color(0x000000),
          });
        } else {
          chartSeries.strokes.template.setAll({
            strokeWidth: 3,
          });
        }
      });
    });

    // When legend item container is unhovered, make all series as they are
    legend.itemContainers.template.events.on('pointerout', () => {
      chart.series.each((chartSeries: any) => {
        chartSeries.strokes.template.setAll({
          strokeOpacity: 1,
          strokeWidth: 2,
          stroke: chartSeries.get('fill'),
        });
      });
    });

    legend.itemContainers.template.set('width', am5.p100);
    legend.valueLabels.template.setAll({
      width: am5.p100,
      textAlign: 'left',
      marginLeft: 16,
    });

    // It's is important to set legend data after all the events are set on template, otherwise events won't be copied
    legend.data.setAll(chart.series.values);

    // Make stuff animate on load
    chart.appear(1000, 100);

    if (!this.dataStatus) {
      this.dataStatus = REQ_STATUS.SUCCESS;
    }
  }
}

export interface ChartLineSerie {
  serie: string;
  data: ChartLineSerieData[];
}

interface ChartLineSerieData {
  date: string | Date | number;
  value: number;
}
