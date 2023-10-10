import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { REQ_STATUS } from 'src/app/constants/general';

@Component({
  selector: 'app-chart-donut',
  templateUrl: './chart-donut.component.html',
  styleUrls: ['./chart-donut.component.scss'],
})
export class ChartDonutComponent implements OnInit, AfterViewInit {
  @Input() category: string = 'category';
  @Input() value: string = 'value';
  @Input() height: string = '350px'; // height property value valid in css
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
    if (!!this.root) {
      this.loadChart();
    }
  }

  chartID: string;
  root: am5.Root;
  series: am5percent.PieSeries;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.loadChart();
    this.cdRef.detectChanges();
  }

  loadChart(): void {
    if (!this.root) {
      this.root = am5.Root.new(this.chartID);
    }

    this.root.setThemes([am5themes_Animated.new(this.root)]);

    // Create chart
    let chart = this.root.container.children.push(
      am5percent.PieChart.new(this.root, {
        radius: am5.percent(90),
        innerRadius: am5.percent(50),
        layout: this.root.horizontalLayout,
      })
    );

    // Create series
    this.series = chart.series.push(
      am5percent.PieSeries.new(this.root, {
        name: 'Series',
        valueField: this.value,
        categoryField: this.category,
      })
    );

    // Set tooltip
    let tooltip = am5.Tooltip.new(this.root, {
      labelText: `[bold]{category}:[/]\n{value} ({valuePercentTotal.formatNumber('#.##')}%)`,
    });

    this.series.set('tooltip', tooltip);

    // Set data
    this.series.data.setAll(this.data);

    // Create legend
    let legend = chart.children.push(
      am5.Legend.new(this.root, {
        centerY: am5.percent(50),
        y: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
        layout: this.root.verticalLayout,
        height: am5.percent(100),
        // clickTarget: 'none',
        forceInactive: true,
        interactive: false,
        hoverOnFocus: true,

        verticalScrollbar: am5.Scrollbar.new(this.root, {
          orientation: 'vertical',
        }),
      })
    );

    // Disabling labels and ticks
    this.series.labels.template.set('visible', false);
    this.series.ticks.template.set('visible', false);
    legend.data.setAll(this.series.dataItems);

    legend.events.on('click', (ev) => {
      this.series.labels.template.set('visible', false);
      this.series.ticks.template.set('visible', false);
    });

    // Play initial series animation
    this.series.appear(1000, 100);

    if (this.dataStatus === REQ_STATUS.INITIAL) {
      this.dataStatus = REQ_STATUS.SUCCESS;
    }
  }
}
