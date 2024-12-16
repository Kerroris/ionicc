import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GeneralService } from '../../services/General.service';
import { AuthService } from '../../services/auth.service';
import { ContactosService } from '../../services/contactos.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: any;
  userId: number | null = null;

  public isLargeScreen: boolean;
  selectedContacts: any[] = [];
  public isPopoverOpen = false;
  urlImg: string | undefined;
  contacts: any[] = [];

  constructor(
    private platform: Platform,
    private generalService: GeneralService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private contactosService: ContactosService
  ) {
    this.isLargeScreen = this.platform.width() >= 765;
    this.platform.resize.subscribe(() => {
      this.checkScreenSize();
    });
  }

  ngOnInit() {
    this.urlImg = environment.urlImg;
  }

  checkScreenSize() {
    this.isLargeScreen = this.platform.width() >= 765;
  }

}
