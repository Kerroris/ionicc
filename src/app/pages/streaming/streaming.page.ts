import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment.prod';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoModalComponent } from '../../componets/video-modal/video-modal.component';

@Component({
  selector: 'app-streaming',
  templateUrl: './streaming.page.html',
  styleUrls: ['./streaming.page.scss'],
})
export class StreamingPage implements OnInit {
  videos: any[] = [];

  constructor(
    private http: HttpClient,
    private modalController: ModalController,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getStreamingVideos();
  }

  getStreamingVideos() {
    const apiKey = environment.Apikey;
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=live&key=${apiKey}`;

    this.http.get(apiUrl).subscribe((response: any) => {
      this.videos = response.items;
    });
  }

  async playVideo(videoId: string) {
    const videoUrl = `https://www.youtube.com/embed/${videoId}`;

    // Sanitizamos el URL
    const sanitizedUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);

    const modal = await this.modalController.create({
      component: VideoModalComponent, // Usamos el componente creado
      componentProps: {
        videoUrl: sanitizedUrl, // Le pasamos el URL del video como propiedad
      },
    });

    await modal.present();
  }
}
