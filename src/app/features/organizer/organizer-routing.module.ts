import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizerComponent } from './organizer.component';
import { NewOrganizerComponent } from './new-organizer/new-organizer.component';
import { EditOrganizerComponent } from './edit-organizer/edit-organizer.component';


const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      component: OrganizerComponent
    },
    {
      path: 'new',
      component: NewOrganizerComponent,
    },
    {
      path: 'edit',
      component: EditOrganizerComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizerRoutingModule {
}
