import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GeneralService } from '../../services/General.service';
import { AuthService } from '../../services/auth.service';
import { ContactosService } from '../../services/contactos.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: any;
  userId: number | null = null;

  public isLargeScreen: boolean;
  selectedContacts: any[] = [];
  public isPopoverOpen = false;
  urlImg: string | undefined;
  contacts: any[] = [];

  constructor(
    private platform: Platform,
    private generalService: GeneralService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private contactosService: ContactosService
  ) {
    this.isLargeScreen = this.platform.width() >= 765;
    this.platform.resize.subscribe(() => {
      this.checkScreenSize();
    });
  }

  onSelect(contact: any, index: number) {
    if (contact.selected) {
      this.selectedContacts.push(contact);
    } else {
      const contactIndex = this.selectedContacts.findIndex(
        (c) => c.id === contact.id
      );
      if (contactIndex !== -1) {
        this.selectedContacts.splice(contactIndex, 1);
      }
    }
    // console.log('Contactos seleccionados: ', this.selectedContacts);
  }

  ngOnInit() {
    this.urlImg = environment.urlImg;
    this.user = this.authService.getUserFromStorage();
    // console.log('User:', this.user);
    this.userId = this.user.id;
    this.getContacts(this.userId);
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
    this.selectedContacts = contact;
    this.isPopoverOpen = true;
  }

  async getContacts(userId: any) {
    //mostrar loadingg
    await this.generalService.presentLoading();

    this.contactosService.getContacts(userId).subscribe({
      next: async (response) => {
        await this.generalService.dismissLoading();
        // console.log(this.contacts);
        // Asignar los contactos de la respuesta a la variable contacts
        this.contacts = response.contactos.map((contacto: any) => ({
          name: contacto.nombre || '',
          email: contacto.email || '',
          phone: contacto.telefon || '',
          id: contacto.id || '',
          avatar: contacto.img,
          selected: false, // Propiedad adicional
        }));
      },
      error: async (error) => {
        await this.generalService.dismissLoading();
        const msj =
          error?.error?.msj || error?.message || 'Ocurrió un error inesperado.';
        const color = 'rgb(255, 5, 5)';
        await this.generalService.mostrarAlerta(msj, color);
      },
    });
  }

  async reloardContacts() {
    this.getContacts(this.userId);
  }

  ionViewWillEnter() {
    this.getContacts(this.userId);
  }

  navigateToContactDetail(contact: any) {
    this.router.navigate(['/navbar/cantact-detalle', contact.id]);
  }

  // eliminar los contactos seleccionados
  async deleteSelectedContacts() {
    const selectedIds = this.selectedContacts.map((contact) => contact.id);

    // Mostrar alerta de confirmación
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar estos contactos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Aceptar',
          handler: async () => {
            await this.generalService.presentLoading();

            this.contactosService.eliminar(selectedIds).subscribe({
              next: async (response) => {
                await this.generalService.dismissLoading();
                const msj = response?.msj || 'success';
                const color = 'rgb(8, 238, 12)';
                await this.generalService.mostrarAlerta(msj, color);
                this.getContacts(this.userId);
              },
              error: async (error) => {
                await this.generalService.dismissLoading();
                const msj =
                  error?.error?.msj ||
                  error?.message ||
                  'Ocurrió un error inesperado.';
                const color = 'rgb(255, 5, 5)';
                await this.generalService.mostrarAlerta(msj, color);
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }
}
