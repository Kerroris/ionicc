import { Component } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-grabacion',
  templateUrl: './grabacion.page.html',
  styleUrls: ['./grabacion.page.scss'],
})
export class GrabacionPage {
  videoUrl: SafeResourceUrl | undefined;

  constructor(private sanitizer: DomSanitizer) {
    this.videoUrl = undefined;
  }

  async recordVideo() {
    const videoInput = document.createElement('input');
    videoInput.type = 'file';
    videoInput.accept = 'video/*';
    videoInput.capture = 'camera';
    videoInput.onchange = async (event: any) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const fileName = `video_${new Date().getTime()}.mp4`;

        // Guardamos el archivo en el directorio de documentos
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data.split(',')[1], // Elimina la cabecera base64
          directory: Directory.Documents,
        });

        // Leemos el archivo guardado para obtener el base64
        const readFile = await Filesystem.readFile({
          path: fileName,
          directory: Directory.Documents,
        });

        // Para la plataforma nativa
        const videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:video/mp4;base64,' + readFile.data);

        // Asignamos la URI sanitizada para el video
        this.videoUrl = videoUrl;
      };
      reader.readAsDataURL(file);
    };
    videoInput.click();
  }

  async shareVideo() {
    const videoUrlString = this.videoUrl?.toString();

    if (videoUrlString) {
      await Share.share({
        title: 'Mira este video',
        text: 'Este es el video que grabé',
        url: videoUrlString,
        dialogTitle: 'Compartir video',
      }).catch((error) => {
        console.error('Error al compartir el video:', error);
      });
    } else {
      console.log('No se encontró un video para compartir.');
    }
  }
}
