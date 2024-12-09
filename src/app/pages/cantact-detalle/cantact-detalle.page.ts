import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '../../services/General.service';
import { AuthService } from '../../services/auth.service';
import { ContactosService } from '../../services/contactos.service';
import { Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

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
    if (this.map) {
      this.map.remove(); // Elimina el mapa anterior
    }

    // Asegúrate de que las coordenadas sean números
    const lat = Number(this.user.lat);
    const lon = Number(this.user.lon);

    // Crear el mapa nuevamente sin permitir el zoom
    this.map = new mapboxgl.Map({
      container: 'mapID',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lon, lat], // Coordenadas iniciales del marcador
      zoom: 13,
      interactive: true, // Habilita las interacciones del mapa (movimiento)
      attributionControl: false, // Desactiva los controles de atribución si es necesario
    });

    // Deshabilitar el zoom
    this.map.scrollZoom.disable();
    this.map.doubleClickZoom.disable();
    this.map.boxZoom.disable();
    this.map.touchZoomRotate.disable();

    // Agregar el marcador en la posición correcta
    const marker = new mapboxgl.Marker({ draggable: false })
      .setLngLat([lon, lat])
      .addTo(this.map);

    // Usar el evento render para mantener el marcador en su lugar
    this.map.on('render', () => {
      marker.setLngLat([lon, lat]); // Reestablece la posición del marcador en cada render
    });
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
