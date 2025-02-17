import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { HomeComponent } from '../features/home/home.component';
import { IndicatorModule } from '../features/indicator/indicator.module';
import { IndicatorComponent } from '../features/indicator/indicator.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'home',
      component: HomeComponent,
    },
    {
      path: 'management',
      loadChildren: () => import('../features/management/management.module').then(m => m.ManagementModule),
    },
    {
      path: 'indicators',
      loadChildren: () => import('../features/indicator/indicator.module').then(m => m.IndicatorModule),
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
