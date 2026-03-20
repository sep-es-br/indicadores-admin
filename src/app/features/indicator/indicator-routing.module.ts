import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndicatorComponent } from './indicator.component';
import { NewIndicatorComponent } from './new-indicator/new-indicator.component';
import { EditIndicatorComponent } from './edit-indicator/edit-indicator.component';
import { IndicatorFormsComponent } from '../../@theme/components/indicator-forms/indicator-forms.component';
import { ModalAddPeriodComponent } from '../../@theme/components/modal-add-period/modal-add-period.component';


const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      component: IndicatorComponent
    },
    {
      path: 'new',
      component: NewIndicatorComponent,
    },
    {
      path: 'edit',
      component: EditIndicatorComponent,
    },
    {
      path:'rese',
      component: ModalAddPeriodComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatorRoutingModule {
}
