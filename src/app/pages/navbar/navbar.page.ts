import { Component, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.page.html',
  styleUrls: ['./navbar.page.scss'],
})
export class NavbarPage implements OnInit {
  public isLoggedIn: boolean = false;
  public isLargeScreen: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private platform: Platform,
    private menuCtrl: MenuController
  ) {
    this.isLargeScreen = this.platform.width() >= 765;
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  openMenu() {
    this.menuCtrl.open('main-menu');
  }

  closeMenu() {
    this.menuCtrl.close('main-menu');
  }
  //☢️ Checa el tamaño de la pantalla
  checkScreenSize() {
    this.isLargeScreen = this.platform.width() >= 765;
  }

  // Función para salir
  onLogout() {
    this.authService.logout();
    window.location.href = '/star/login';
    // this.router.navigate(['/navbar/login']);
  }
}
