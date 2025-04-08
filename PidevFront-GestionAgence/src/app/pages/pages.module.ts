import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesRoutes } from './pages.routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { AppDashboardComponent } from './admin/dashboard/dashboard.component';
import { UsersComponent } from './admin/users/users.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { OtpVerificationComponent } from './user/otp-verification/otp-verification.component';
import { AgencesComponent } from './admin/agences/agences.component'; // Import AgencesComponent
import { AdminRoutingModule } from './admin/admin-routing.module';

@NgModule({
  declarations: [AppDashboardComponent,UsersComponent,LoginComponent,SignupComponent,OtpVerificationComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    RouterModule.forChild(PagesRoutes),
    TablerIconsModule.pick(TablerIcons),
  ],
  exports: [TablerIconsModule],
})
export class PagesModule {}
