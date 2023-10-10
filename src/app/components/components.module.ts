import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../modules/shared/shared.module';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgbModule,
        SharedModule
    ],
    declarations: [
        SidebarComponent
    ],
    exports: [
        SidebarComponent
    ]
})
export class ComponentsModule { }
