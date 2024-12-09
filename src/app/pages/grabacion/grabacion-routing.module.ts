import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GrabacionPage } from './grabacion.page';

const routes: Routes = [
  {
    path: '',
    component: GrabacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GrabacionPageRoutingModule {}
