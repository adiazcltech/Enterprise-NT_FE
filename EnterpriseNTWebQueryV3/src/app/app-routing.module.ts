import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/account/login/login.component';
import { DashboardComponent } from './modules/configuration/dashboard/dashboard.component';
import { authGuard } from './guards/auth/auth.guard';
import { ViewerComponent } from './modules/stimulsoft/viewer/viewer.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [ authGuard ]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [ authGuard ]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'login/:token',
    component: LoginComponent,
  },
  {
    path: 'viewreport',
    component: ViewerComponent,
    canActivate: [ authGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false} )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
