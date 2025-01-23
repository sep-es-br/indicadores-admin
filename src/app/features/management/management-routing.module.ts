import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementComponent } from './management.component';
import { NewManagementComponent } from './new-management/new-management.component';
import { EditManagementComponent } from './edit-management/edit-management.component';


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
    },
    {
      path: 'edit',
      component: EditManagementComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule {
}
