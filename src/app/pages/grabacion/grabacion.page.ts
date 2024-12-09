import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Share } from '@capacitor/share';
import { Platform } from '@ionic/angular';
import { PermissionsService } from '../../services/Permissions.service'; // Asumimos que tienes un servicio para manejar permisos

@Component({
  selector: 'app-grabacion',
  templateUrl: './grabacion.page.html',
  styleUrls: ['./grabacion.page.scss'],
})
export class GrabacionPage implements OnInit {
  videoUrl: string | null = null; // Para almacenar la URL del video
  isRecording: boolean = false;

  constructor(private platform: Platform, private permissionsService: PermissionsService) {}

  ngOnInit() {
    if (!this.platform.is('mobile')) {
      // En Web, muestra un mensaje indicando que no se puede grabar video
      this.videoUrl = 'http://example.com/sample-video.mp4'; // Video de ejemplo para web
    }
  }

  // Función para grabar el video
  async grabarVideo() {
    try {
      // Verificar si estamos en una plataforma móvil
      if (!this.platform.is('mobile')) {
        console.error('La grabación de video no está soportada en Web');
        return;
      }

      // Verificar permisos para acceder a la cámara
      const hasPermission = await this.permissionsService.requestCameraPermission();
      if (!hasPermission) {
        console.error('Permiso de cámara denegado');
        return;
      }

      // Configuración para capturar video
      const capturedVideo = await Camera.getPhoto({
        quality: 100,
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
        // Esto no es posible en web, se requiere un plugin adicional para video.
      });

      if (capturedVideo && capturedVideo.webPath) {
        this.videoUrl = capturedVideo.webPath; // Guardar la URL del video grabado
      }
    } catch (error) {
      console.error('Error al grabar video', error);
    }
  }

  // Función para compartir el video
  async compartirVideo() {
    if (this.videoUrl) {
      try {
        await Share.share({
          title: 'Comparte este video',
          text: 'Mira este video',
          url: this.videoUrl,
        });
      } catch (error) {
        console.error('Error al compartir el video', error);
      }
    }
  }
}
