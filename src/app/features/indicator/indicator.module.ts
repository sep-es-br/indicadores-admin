import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbButtonModule, NbContextMenuModule, NbIconModule, NbSelectModule, NbSpinnerModule, NbToggleModule } from '@nebular/theme';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, NgSelectOption, ReactiveFormsModule } from '@angular/forms';
import { IndicatorComponent } from './indicator.component';
import { IndicatorRoutingModule } from './indicator-routing.module';
import { NewIndicatorComponent } from './new-indicator/new-indicator.component';
import { EditIndicatorComponent } from './edit-indicator/edit-indicator.component';



@NgModule({
  declarations: [
    IndicatorComponent,
    NewIndicatorComponent,
    EditIndicatorComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    NbIconModule,
    NbButtonModule,
    NbContextMenuModule,
    IndicatorRoutingModule,
    ThemeModule,
    ReactiveFormsModule,
    FormsModule,
    NbToggleModule,
    NbSelectModule,
    NbSpinnerModule
  ]
})
export class  IndicatorModule { }
