import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementComponent } from './management.component';
import { NewManagementComponent } from './new-management/new-management.component';
import { EditManagementComponent } from './edit-management/edit-management.component';
import { EditOrganizerComponent } from './edit-organizer/edit-organizer.component';
import { NewOrganizerComponent } from './new-organizer/new-organizer.component';
import { NewChallengeComponent } from './new-challenge/new-challenge.component';
import { EditChallengeComponent } from './edit-challenge/edit-challenge.component';


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
    },
    {
      path: 'new-organizer',
      component: NewOrganizerComponent,
    },
    {
      path: 'new-challenge',
      component: NewChallengeComponent,
    },
    {
      path: 'edit-organizer',
      component: EditOrganizerComponent
    },
    {
      path: 'edit-challenge',
      component: EditChallengeComponent
    }


  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule {
}
