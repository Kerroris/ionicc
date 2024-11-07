import { Component } from '@angular/core';
import {Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public isLargeScreen: boolean;
  public selectedContact: any; // Contacto seleccionado para editar o eliminar
  public isPopoverOpen = false;

  contacts = [
    {
      name: 'Héctor Cervantes Yañez',
      email: 'cervaya@gmail.com',
      phone: '+52 441 265 230 1',
      avatar: 'assets/img/avatar/avatar1.png',
      selected: false,
    },
    {
      name: 'Sabastian Gildardo Andoney',
      email: 'sebas@gmail.com',
      phone: '+52 441 170 232 5',
      avatar: 'assets/img/avatar/avatar1.png',
      selected: false,
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+987 654 321',
      avatar: 'assets/img/avatar/avatar1.png',
      selected: false,
    },
  ];

  constructor(
    private platform: Platform,
  ) {
    this.isLargeScreen = this.platform.width() >= 765;

    this.platform.resize.subscribe(() => {
      this.checkScreenSize();
    });}

  onSelect(contact: any, index: number) {
    console.log(`Contacto seleccionado: ${contact.name}, Estado: ${contact.selected}`);
  }
  
  checkScreenSize() {
    this.isLargeScreen = this.platform.width() >= 765;
  }

  editContact(contact: any) {
    console.log(`Editar contacto: ${contact.name}`);
  }

  deleteContact(contact: any) {
    console.log(`Eliminar contacto: ${contact.name}`);
  }

  async openPopover(contact: any) {
    this.selectedContact = contact;
    this.isPopoverOpen = true;
  }
}
