import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';

interface LoginResponse {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  loading!: HTMLIonLoadingElement;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  // ☢️ Mostrar alerta
  async showErrorAlert(msj: any, header: any) {
    const alert = await this.alertController.create({
      header: header,
      message: `${msj}` || 'Ocurrió un error, intenta nuevamente.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  // ☢️ Muestra el loading
  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'bubbles', // Tipo de spinner
      cssClass: 'my-custom-loading-3', // Clase CSS
      message: 'Cargando...', // Mensaje opcional
    });
    await this.loading.present();
  }

  // ☢️ Oculta el loading
  async dismissLoading() {
    if (this.loading) {
      await this.loading.dismiss(); // Oculta el loading si esta presente
    }
  }
}

// subscribe(
//   (response) => {
//     const msj = response?.msj || 'Login exitoso';
//     const header = 'Success ✅';
//     this.showErrorAlert(msj, header);
//   },
//   (error) => {
//     const msj = error?.error?.msj || error?.message || 'Ocurrió un error inesperado.';
//     const header = 'Error ❌';
//     this.showErrorAlert(msj, header);
//   }
// );
