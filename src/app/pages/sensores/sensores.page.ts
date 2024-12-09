import { Component, OnDestroy } from '@angular/core';
import { Motion } from '@capacitor/motion';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-sensores',
  templateUrl: './sensores.page.html',
  styleUrls: ['./sensores.page.scss'],
})
export class SensoresPage implements OnDestroy {
  accelX: number = 0;
  accelY: number = 0;
  accelZ: number = 0;
  motionListener: any;
  public isLargeScreen: boolean;

  constructor(private platform: Platform) {
    this.isLargeScreen = this.platform.width() >= 765;
  }

  // Iniciar lectura del acelerómetro
  startTracking() {
    this.motionListener = Motion.addListener('accel', (event) => {
      this.accelX = event.acceleration.x || 0;
      this.accelY = event.acceleration.y || 0;
      this.accelZ = event.acceleration.z || 0;
    });
  }

  // Detener lectura del acelerómetro
  stopTracking() {
    if (this.motionListener) {
      this.motionListener.remove();
    }
  }

  //☢️ Checa el tamaño de la pantalla
  checkScreenSize() {
    this.isLargeScreen = this.platform.width() >= 765;
  }

  // Limpiar al destruir el componente
  ngOnDestroy() {
    this.stopTracking();
  }
  
}
