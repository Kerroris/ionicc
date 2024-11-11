import { Component, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.page.html',
  styleUrls: ['./navbar.page.scss'],
})
export class NavbarPage implements OnInit {
  public isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {
    // console.log('Hola - ☢️');

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

  // Función para salir
  onLogout() {
    this.authService.logout();
    window.location.href = '/navbar/login';
    // this.router.navigate(['/navbar/login']);
  }
}
