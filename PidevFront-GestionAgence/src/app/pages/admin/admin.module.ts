import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgencesComponent } from './agences/agences.component';
import { AgenceDetailsComponent } from './agences/agence-details/agence-details.component';
import { StatisticsDashboardComponent } from './dashboard/statistics-dashboard/statistics-dashboard.component';
import { PerformancesComponent } from './performances/performances.component';
import { HttpClientModule } from '@angular/common/http';
import { AgenceFormDialogComponent } from './agences/agence-form-dialog/agence-form-dialog.component';
import { PerformanceFormDialogComponent } from './performances/performance-form-dialog/performance-form-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule,
    MatButtonModule
  ],
  declarations: [
    AgencesComponent,
    AgenceDetailsComponent,
    StatisticsDashboardComponent,
    PerformancesComponent,
    AgenceFormDialogComponent,
    PerformanceFormDialogComponent
  ]
})
export class AdminModule { }