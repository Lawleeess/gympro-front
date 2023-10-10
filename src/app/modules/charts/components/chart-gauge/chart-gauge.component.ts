import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5radar from '@amcharts/amcharts5/radar';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-chart-gauge',
  templateUrl: './chart-gauge.component.html',
  styleUrls: ['./chart-gauge.component.scss'],
})
export class ChartGaugeComponent implements OnInit, AfterViewInit {
  chartID: string;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-gauge-${this.name}`;
  }

  private _value: number = 0;
  get value() {
    return this._value;
  }
  @Input() set value(value) {
    this._value = value;

    if (this.axisDataItem) {
      this.axisDataItem.set('value', this.value);
    }
  }

  axisDataItem;
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadChart();
  }

  loadChart(): void {
    let root = am5.Root.new(this.chartID);

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5radar.RadarChart.new(root, {
        panX: false,
        panY: false,
        startAngle: 180,
        endAngle: 360,
      })
    );

    chart.getNumberFormatter().set('numberFormat', "#'%'");

    let axisRenderer = am5radar.AxisRendererCircular.new(root, {
      innerRadius: -10,
      minGridDistance: 10000,
    });

    axisRenderer.labels.template.setAll({
      fontSize: '0.75rem',
    });

    axisRenderer.grid.template.setAll({
      stroke: root.interfaceColors.get('background'),
      visible: true,
      strokeOpacity: 0.8,
    });

    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        max: 100,
        strictMinMax: true,
        renderer: axisRenderer,
      })
    );

    // Add clock hand
    let axisDataItem = xAxis.makeDataItem({});

    let clockHand = am5radar.ClockHand.new(root, {
      pinRadius: 0,
      radius: am5.percent(0),
      innerRadius: 0,
      bottomWidth: 0,
      topWidth: 0,
    });

    let bullet = axisDataItem.set(
      'bullet',
      am5xy.AxisBullet.new(root, {
        sprite: clockHand,
      })
    );

    xAxis.createAxisRange(axisDataItem);

    let label = chart.radarContainer.children.push(
      am5.Label.new(root, {
        centerX: am5.percent(50),
        textAlign: 'center',
        centerY: am5.percent(70),
        fontSize: '1.3em',
      })
    );

    axisDataItem.set('value', this.value);
    this.axisDataItem = axisDataItem;

    bullet.get('sprite').on('rotation', function () {
      let value = axisDataItem.get('value');
      label.set('text', Math.round(value).toString() + '%');
    });

    chart.bulletsContainer.set('mask', undefined);

    let axisRange0 = xAxis.createAxisRange(
      xAxis.makeDataItem({
        above: true,
        value: 0,
        endValue: this.value,
      })
    );

    axisRange0.get('axisFill').setAll({
      visible: true,
      fill: am5.color('#43C1C6'),
    });

    axisRange0.get('label').setAll({
      forceHidden: true,
    });

    let axisRange1 = xAxis.createAxisRange(
      xAxis.makeDataItem({
        above: true,
        value: this.value,
        endValue: 100,
      })
    );

    axisRange1.get('axisFill').setAll({
      visible: true,
      fill: am5.color('#e7e7e7'),
    });

    axisRange1.get('label').setAll({
      forceHidden: true,
    });
  }
}
