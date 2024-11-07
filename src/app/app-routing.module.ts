import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
 

const routes: Routes = [
  {
    path: '',
    redirectTo: 'navbar/login',
    pathMatch: 'full',
  },
  {
    path: 'navbar',
    loadChildren: () =>
      import('./pages/navbar/navbar.module').then((m) => m.NavbarPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
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
    path: 'cantact-detalle',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/cantact-detalle/cantact-detalle.module').then(
        (m) => m.CantactDetallePageModule
      ),
  },
  {
    path: 'add-contacto',
    loadChildren: () => import('./pages/add-contacto/add-contacto.module').then( m => m.AddContactoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
