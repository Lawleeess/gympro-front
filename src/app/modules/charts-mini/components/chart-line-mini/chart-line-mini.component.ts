import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { REQ_STATUS } from 'src/app/constants/general';
import isEmpty from 'lodash-es/isEmpty';

@Component({
  selector: 'app-chart-line-mini',
  templateUrl: './chart-line-mini.component.html',
  styleUrls: ['./chart-line-mini.component.scss'],
})
export class ChartLineMiniComponent implements OnInit {
  private _data: any[];
  get data(): any[] {
    return this._data;
  }
  @Input() set data(value: any[]) {
    this._data = value;

    const { labels, data } = this.parseDataForChat(value);
    this.updateChartDataForChat(labels, data);
  }

  @Input() categoryName: string = 'date'; // property key in object arrays that represents the lineChartData.labels (x Axis data)
  @Input() valueName: string = 'value'; // property key in object arrays that represents the lineChartData.datasets[0].data (y Axis data)
  @Input() decimalInValues: number = 0; // number of decimals for values in chart
  @Input() heightPx: number = 30; // works with px instead rem by ng2-charts setup
  @Input() widthPx: number = 100; // works with px instead rem by ng2-charts setup
  @Input() lineColor: string = '#05adb4'; // valid css color
  @Input() dataStatus: number = REQ_STATUS.SUCCESS;
  @Input() emptyDataMsg: string = 'No se encontraron datos.';

  lineChartType: ChartType = 'line';
  lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.1,
      },
    },
    responsive: false,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          display: false,
        },
      ],
      yAxes: [
        {
          display: false,
        },
      ],
    },
  };

  lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        label: 'Series 1',
        pointRadius: 0,
        data: [],
        fill: false,
        borderColor: this.lineColor,
        borderWidth: 2,
      },
    ],
    labels: [],
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  constructor() {}

  ngOnInit(): void {}

  parseDataForChat(dataList: any[]) {
    const labels: string[] = [];
    const data: number[] = [];

    if (!isEmpty(dataList)) {
      for (const i of dataList) {
        labels.push(i[this.categoryName]);
        data.push(i[this.valueName]);
      }
    }

    return { labels, data };
  }

  updateChartDataForChat(labels: any[], data: number[]) {
    this.lineChartData.labels = labels;
    this.lineChartData.datasets[0].data = this.parsedDataWithValueFormat(data);
  }

  parsedDataWithValueFormat(data: number[]): number[] {
    const parsedData: number[] = [];

    for (const i of data) {
      if (this.decimalInValues === 0) {
        parsedData.push(Math.round(i));
      } else {
        const parsedValue = +parseFloat(i.toString()).toFixed(
          this.decimalInValues
        );
        parsedData.push(parsedValue);
      }
    }
    return parsedData;
  }
}
