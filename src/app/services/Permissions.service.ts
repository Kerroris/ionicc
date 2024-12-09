import { Injectable } from '@angular/core';
import { Camera } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {

  async requestCameraPermission(): Promise<boolean> {
    const { photos } = await Camera.requestPermissions();

    if (photos !== 'granted') {
      // Si el permiso no es otorgado, devolvemos falso
      return false;
    }
    return true;
  }
}
