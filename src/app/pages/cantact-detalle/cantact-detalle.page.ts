import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '../../services/General.service';
import { ContactosService } from '../../services/contactos.service';
import { Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { Share } from '@capacitor/share';

import * as mapboxgl from 'mapbox-gl';

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
  map: any;

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
    (mapboxgl as any).accessToken =
      'pk.eyJ1IjoiY2VydmF5YSIsImEiOiJjbTRnNnV0bzgxaGswMmpvbWszdXczYXU3In0.UTY3YidMQdlWEvP2Yg7Lkg';
  }

  async getContacto(userId: any) {
    //mostrar loadingg
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

  loadMap() {
    const lat = Number(this.user.lat);
    const lon = Number(this.user.lon);

    if (isNaN(lat) || isNaN(lon)) {
      console.error('Invalid coordinates:', lat, lon);
      return;
    }

    console.log('Initial coordinates:', lat, lon);

    this.map = new mapboxgl.Map({
      container: 'mapID',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lon, lat],
      zoom: 13,
      interactive: true,
      attributionControl: false,
    });

    this.map.on('load', () => {
      const mapCenter = this.map.getCenter();
      console.log('Map center:', mapCenter);

      // Verificación de coordenadas antes de colocar el marcador
      console.log('Coordinates for marker placement:', { lng: lon, lat: lat });

      new mapboxgl.Marker({ draggable: false })
        .setLngLat([lon, lat])
        .addTo(this.map);

      console.log('Marker coordinates:', [lon, lat]);
    });

    // Deshabilitando interacciones de zoom
    this.map.scrollZoom.disable();
    this.map.doubleClickZoom.disable();
    this.map.boxZoom.disable();
    this.map.touchZoomRotate.disable();
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
    // Separa los ultimos 10 dígitos para el número principal
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
