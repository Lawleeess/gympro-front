import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartLoaderComponent } from './components/chart-loader/chart-loader.component';
import { ChartGaugeComponent } from './components/chart-gauge/chart-gauge.component';
import { ChartLineSeriesComponent } from './components/chart-line-series/chart-line-series.component';
import { ChartLineComponent } from './components/chart-line/chart-line.component';
import { ChartDonutComponent } from './components/chart-donut/chart-donut.component';
import { ChartSortedBarComponent } from './components/chart-sorted-bar/chart-sorted-bar.component';
import { ChartLineUpsDownsComponent } from './components/chart-line-ups-downs/chart-line-ups-downs.component';

const CHARTS = [
  ChartLoaderComponent,
  ChartGaugeComponent,
  ChartLineSeriesComponent,
  ChartLineComponent,
  ChartDonutComponent,
  ChartSortedBarComponent,
  ChartLineUpsDownsComponent,
];

@NgModule({
  declarations: [...CHARTS],
  imports: [CommonModule],
  exports: [...CHARTS],
})
export class ChartsModule {}
