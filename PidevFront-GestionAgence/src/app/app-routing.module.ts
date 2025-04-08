import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { FullUserComponent } from './layouts/fullUser/full.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/user/signup/signup.component';
import { OtpVerificationComponent } from './pages/user/otp-verification/otp-verification.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Default to login
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent, // Login is defined at the root
  },
  {
    path: 'signup',
    component: SignupComponent, // Login is defined at the root
  },
  {
    path: 'verify',
    component: OtpVerificationComponent, // Login is defined at the root
  },
  {
    path: 'admin',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        // Load PagesModule at an empty path under /admin.
        // Inside PagesModule, the route "dashboard" will result in /admin/dashboard.
        path: '',
        loadChildren: () =>
          import('./pages/admin/admin-routing.module').then((m) => m.AdminRoutingModule),
      },
    
    ],
  },
  {
    path: 'user',
    component: FullUserComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
      },
     
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}