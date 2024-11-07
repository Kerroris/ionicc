import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddContactoPageRoutingModule } from './add-contacto-routing.module';

import { AddContactoPage } from './add-contacto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddContactoPageRoutingModule
  ],
  declarations: [AddContactoPage]
})
export class AddContactoPageModule {}
