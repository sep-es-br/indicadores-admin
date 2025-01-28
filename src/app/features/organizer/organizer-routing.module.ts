import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizerComponent } from './organizer.component';
import { NewOrganizerComponent } from './new-organizer/new-organizer.component';


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
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizerRoutingModule {
}
