import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ManagementComponent } from './management.component';
import { NbButtonModule, NbContextMenuModule, NbIconModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../@theme/theme.module';
import { ManagementRoutingModule } from './management-routing.module';
import { NewManagementComponent } from './new-management/new-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../@theme/components/breadcrumb/breadcrumb.component';
import { EditManagementComponent } from './edit-management/edit-management.component';


@NgModule({
  declarations: [
    ManagementComponent,
    NewManagementComponent,
    EditManagementComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    NbIconModule,
    NbButtonModule,
    NbContextMenuModule,
    ThemeModule,
    ManagementRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class  ManagementModule { }
