import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ManagementComponent } from './management.component';
import { NbButtonModule, NbContextMenuModule, NbIconModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../@theme/theme.module';
import { ManagementRoutingModule } from './management-routing.module';
import { NewManagementComponent } from './new-management/new-management.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ManagementComponent,
    NewManagementComponent
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
  ]
})
export class  ManagementModule { }
