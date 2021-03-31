import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountBugsComponent } from './count-bugs/count-bugs.component';
//import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
  path: '',
  component: CountBugsComponent,
  children: [
    {
      path: 'statistics',
      component: CountBugsComponent,      
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }

export const routedComponents = [
  CountBugsComponent,  
];
