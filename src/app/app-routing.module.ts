import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notauth.guard';
 

const routes: Routes = [
  {
    path: '',
    redirectTo: 'star/login',
    pathMatch: 'full',
  },
  {
    path: 'star',
    loadChildren: () =>
      import('./pages/navbar/navbar.module').then((m) => m.NavbarPageModule),
  },
  {
    path: 'login',
    canActivate: [NotAuthGuard],
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    canActivate: [NotAuthGuard],
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '**',
    loadChildren: () => import('./pages/error/error.module').then( m => m.ErrorPageModule)
  },
  {
    path: 'streaming',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/streaming/streaming.module').then( m => m.StreamingPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
