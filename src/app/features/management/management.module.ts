import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ManagementComponent } from './management.component';
import { NbButtonModule, NbContextMenuModule, NbIconModule, NbSelectModule, NbToggleModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../@theme/theme.module';
import { ManagementRoutingModule } from './management-routing.module';
import { NewManagementComponent } from './new-management/new-management.component';
import { FormsModule, NgSelectOption, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../@theme/components/breadcrumb/breadcrumb.component';
import { EditManagementComponent } from './edit-management/edit-management.component';
import { NewOrganizerComponent } from './new-organizer/new-organizer.component';
import { EditOrganizerComponent } from './edit-organizer/edit-organizer.component';
import { NewChallengeComponent } from './new-challenge/new-challenge.component';
import { EditChallengeComponent } from './edit-challenge/edit-challenge.component';


@NgModule({
  declarations: [
    ManagementComponent,
    NewManagementComponent,
    EditManagementComponent,
    NewOrganizerComponent,
    EditOrganizerComponent,
    NewChallengeComponent,
    EditChallengeComponent
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
    NbToggleModule,
    NbSelectModule
  ]
})
export class  ManagementModule { }
