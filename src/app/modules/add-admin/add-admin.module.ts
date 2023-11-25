import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAdminComponent } from './add-admin.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

// components

import { SharedModule } from '../shared/shared.module';

// angular material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    AddAdminComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AddAdminModule { }
