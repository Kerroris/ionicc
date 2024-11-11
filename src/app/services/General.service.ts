import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
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
  private renderer: Renderer2;

  constructor(
    private alertController: AlertController,
    rendererFactory: RendererFactory2,
    private loadingController: LoadingController
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

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
    const container = document.getElementById('container_loadin_all');

    if (container) {
      this.renderer.addClass(container, 'loadin_all');
    }

    // this.loading = await this.loadingController.create({
    //   spinner: null, // Tipo de spinner
    //   cssClass: 'loadin_all', // CSS
    //   // message: 'Cargando...', // Mensaje opcional
    // });
    // await this.loading.present();

  }

  // ☢️ Oculta el loading
  async dismissLoading() {
    const container = document.getElementById('container_loadin_all');

    if (container) {
      this.renderer.removeClass(container, 'loadin_all');
    }
  }

  async mostrarAlerta(mensaje: string, color: string): Promise<void> {
    const container = document.getElementById('alert_all');

    if (container) {
      // Limpia el contenido
      container.innerHTML = '';

      // Crea el elemento de alerta
      const alertElement = this.renderer.createElement('div');
      this.renderer.addClass(alertElement, 'alert');

      // Establece el mensaje y el estilo de borde
      alertElement.innerText = mensaje;
      this.renderer.setStyle(
        alertElement,
        'border-bottom',
        `5px solid ${color}`
      );

      // Agregarr elemento de alerta al contenedor
      this.renderer.appendChild(container, alertElement);

      setTimeout(() => {
        this.renderer.addClass(alertElement, 'show');
      }, 1000);

      setTimeout(() => {
        this.renderer.removeClass(alertElement, 'show');
        this.renderer.removeChild(container, alertElement);
      }, 8000);
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
