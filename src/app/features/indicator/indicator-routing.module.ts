import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndicatorComponent } from './indicator.component';
import { NewIndicatorComponent } from './new-indicator/new-indicator.component';


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
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatorRoutingModule {
}
