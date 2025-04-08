import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgencesComponent } from './agences/agences.component';
import { StatisticsDashboardComponent } from './dashboard/statistics-dashboard/statistics-dashboard.component';
import { PerformancesComponent } from './performances/performances.component';

const routes: Routes = [
  {
    path: 'agences',
    component: AgencesComponent
  },
  {
    path: 'performances',
    component: PerformancesComponent
  },
  {
    path: 'dashboard',
    component: StatisticsDashboardComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
