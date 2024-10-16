import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementComponent } from './management.component';
import { NewManagementComponent } from './new-management/new-management.component';


const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      component: ManagementComponent
    },
    {
      path: 'new',
      component: NewManagementComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule {
}
