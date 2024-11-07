import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CantactDetallePage } from './cantact-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: CantactDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CantactDetallePageRoutingModule {}
