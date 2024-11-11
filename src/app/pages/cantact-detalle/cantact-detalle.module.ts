import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CantactDetallePageRoutingModule } from './cantact-detalle-routing.module';

import { CantactDetallePage } from './cantact-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CantactDetallePageRoutingModule
  ],
  declarations: [CantactDetallePage]
})
export class CantactDetallePageModule {}
