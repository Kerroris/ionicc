import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { NotAuthGuard } from '../../guards/notauth.guard';
import { NavbarPage } from './navbar.page';

const routes: Routes = [
  {
    path: '',
    component: NavbarPage,
    children: [
      {
        path: 'login',
        canActivate: [NotAuthGuard],
        loadChildren: () =>
          import('../login/login.module').then((m) => m.LoginPageModule),
      },
      {
        path: 'register',
        canActivate: [NotAuthGuard],
        loadChildren: () =>
          import('../register/register.module').then((m) => m.RegisterPageModule),
      },
      {
        path: 'home',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'streaming',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../streaming/streaming.module').then((m) => m.StreamingPageModule),
      },
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavbarPageRoutingModule {}
