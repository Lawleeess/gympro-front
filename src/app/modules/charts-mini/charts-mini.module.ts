import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { ChartLineMiniComponent } from './components/chart-line-mini/chart-line-mini.component';

const CHARTS = [ChartLineMiniComponent];

@NgModule({
  declarations: [...CHARTS],
  imports: [CommonModule, ChartsModule],
  exports: [...CHARTS, ChartsModule],
})
export class ChartsMiniModule {}
