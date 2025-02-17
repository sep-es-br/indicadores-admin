import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbButtonModule, NbContextMenuModule, NbIconModule, NbSelectModule, NbToggleModule } from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, NgSelectOption, ReactiveFormsModule } from '@angular/forms';
import { IndicatorComponent } from './indicator.component';
import { IndicatorRoutingModule } from './indicator-routing.module';



@NgModule({
  declarations: [
    IndicatorComponent
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
    NbSelectModule
  ]
})
export class  IndicatorModule { }
