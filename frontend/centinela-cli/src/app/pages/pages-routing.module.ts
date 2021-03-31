import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

import { RoleGuard } from 'app/guard/role.guard';
import { StatisticsModule } from './statistics/statistics.module';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./bugs/bugs.module')
        .then(m => m.BugsModule),
    },
    {
      path: '',
      canActivateChild: [RoleGuard],
      loadChildren: () => import('./systems/systems.module')
        .then(m => m.SystemsModule),
    },
    {
      path: '',
      canActivateChild: [RoleGuard],
      loadChildren: () => import('./invitations/invitations.module')
        .then(m => m.InvitationsModule),
    },
    {
      path: '',
      canActivateChild: [RoleGuard],
      loadChildren: () => import('./statistics/statistics.module')
        .then(m => m.StatisticsModule),
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
