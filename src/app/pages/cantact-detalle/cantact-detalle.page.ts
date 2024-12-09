import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '../../services/General.service';
import { ContactosService } from '../../services/contactos.service';
import { Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { Share } from '@capacitor/share';
import { Geolocation } from '@capacitor/geolocation'; // Importación corregida

@Component({
  selector: 'app-cantact-detalle',
  templateUrl: './cantact-detalle.page.html',
  styleUrls: ['./cantact-detalle.page.scss'],
})
export class CantactDetallePage implements OnInit {
  countries: any[] = [];
  selectedPhoneCode: string | null = null;
  selectedCountry: any;
  selectedImage: string | null = null;
  urlImg: string | undefined;

  user: any = {};
  public isLargeScreen: boolean;
  public showForm: boolean = false;
  public contactId: number | null = null;
  mapContainer: HTMLElement | null = null;

  constructor(
    private fb: FormBuilder,
    private generalService: GeneralService,
    private contactosService: ContactosService,
    private platform: Platform,
    private activatedRoute: ActivatedRoute
  ) {
    this.isLargeScreen = this.platform.width() >= 765;
  }

  ngOnInit() {
    this.urlImg = environment.urlImg;
    this.showForm = false;
    // Obtén el ID de la URL
    this.contactId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getContacto(this.contactId);
  }

  async getContacto(userId: any) {
    // Mostrar loading
    await this.generalService.presentLoading();

    this.contactosService.getContacto(userId).subscribe({
      next: async (response) => {
        this.user = response.contacto[0] || {};
        await this.generalService.dismissLoading();
        if (this.user.lat && this.user.lon) {
          this.loadMap();
        }
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

  async loadMap() {
    const lat = Number(this.user.lat);
    const lon = Number(this.user.lon);
  
    if (isNaN(lat) || isNaN(lon)) {
      console.error('Invalid coordinates:', lat, lon);
      return;
    }
  
    // Obtener contenedor del mapa
    this.mapContainer = document.getElementById('mapID');
    if (!this.mapContainer) {
      console.error('Map container not found.');
      return;
    }
  
    // Limpia el contenedor si ya tiene contenido previo
    this.mapContainer.innerHTML = '';
  
    // Crear y mostrar un mapa básico con un marcador estático
    const mapHtml = `
      <iframe
        width="100%"
        height="400px"
        frameborder="0"
        src="https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed&markers=${lat},${lon}"
        allowfullscreen>
      </iframe>`;
    this.mapContainer.innerHTML = mapHtml;
  
    console.log(`Mapa cargado con marcador en las coordenadas: [${lat}, ${lon}]`);
  }
  
  async shareContact() {
    const name = `${this.user.nombre} ${this.user.apellido}`;
    const phone = this.formatPhoneNumber(this.user.telefon || '');
    const email = this.user.email || 'No proporcionado';
    const address = this.user.direccion || 'No proporcionada';

    // Crear el mensaje con los datos del contacto
    const message =
      `Información del contacto:\n` +
      `Nombre: ${name}\n` +
      `Teléfono: ${phone}\n` +
      `Correo electrónico: ${email}\n` +
      `Dirección: ${address}`;

    try {
      await Share.share({
        title: `Compartir contacto: ${name}`,
        text: message,
        dialogTitle: 'Compartir contacto',
      });
    } catch (error) {
      console.error('Error al compartir el contacto:', error);
    }
  }

  formatPhoneNumber(phone: string): string {
    if (!phone || phone.length < 10) return phone;
    // Separa los últimos 10 dígitos para el número principal
    const mainNumber = phone.slice(-10);
    const areaCode = phone.slice(0, phone.length - 10);
    // Formateo del número principal
    const formattedNumber = `${mainNumber.slice(0, 4)} ${mainNumber.slice(
      4,
      7
    )} ${mainNumber.slice(7)}`;

    // Devuelve la lada y el número formateado
    return `${areaCode} ${formattedNumber}`;
  }
}
