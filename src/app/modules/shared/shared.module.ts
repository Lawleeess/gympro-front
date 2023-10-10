// modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsMiniModule } from '../charts-mini/charts-mini.module';

// components
import { ModalComponent } from './components/modal/modal.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { GenericSelectComponent } from './components/generic-select/generic-select.component';
import { GenericTableComponent } from './components/generic-table/generic-table.component';
import { MainTabSelectorComponent } from './components/main-tab-selector/main-tab-selector.component';
import { RedirectButtonComponent } from './components/redirect-button/redirect-button.component';
import { ModuleUnderConstructionComponent } from './components/module-under-construction/module-under-construction.component';
import { DroptipComponent } from './components/droptip/droptip.component';
import { ViewModeSelectorComponent } from './components/view-mode-selector/view-mode-selector.component';

// angular material
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const ANGULAR_MATERIAL_MODULES = [
  MatDialogModule,
  MatButtonModule,
  MatSnackBarModule,
  MatSelectModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatInputModule,
  MatSidenavModule,
  MatTreeModule,
  MatIconModule,
  MatMenuModule,
  MatCardModule,
  MatStepperModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTabsModule,
  MatListModule,
  MatExpansionModule,
  MatProgressBarModule,
];

const COMPONENTS = [
  ModalComponent,
  SnackBarComponent,
  GenericSelectComponent,
  GenericTableComponent,
  RedirectButtonComponent,
  MainTabSelectorComponent,
  ModuleUnderConstructionComponent,
  DroptipComponent,
  ViewModeSelectorComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    ChartsMiniModule,
    ...ANGULAR_MATERIAL_MODULES,
  ],
  exports: [...COMPONENTS, ...ANGULAR_MATERIAL_MODULES],
})
export class SharedModule {}
