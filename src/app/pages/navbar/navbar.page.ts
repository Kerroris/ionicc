import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.page.html',
  styleUrls: ['./navbar.page.scss'],
})
export class NavbarPage implements OnInit {
  public isLoggedIn: boolean = false;

  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    
    // console.log('Hola - ☢️');

    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    // ------ -----
    const alertElement = document.querySelector('.alert');
    // Verifica que el elemento exista antes de intentar agregar o remover clases
    if (alertElement) {
      // Mostrar alerta despus de 1 segundo
      setTimeout(() => {
        this.renderer.addClass(alertElement, 'show');
      }, 1000);

      // Ocultar la alerta 
      setTimeout(() => {
        this.renderer.removeClass(alertElement, 'show');
      }, 5000);
    }
  }

  // Función para salir
  onLogout() {
    this.authService.logout();
    window.location.href = '/navbar/login';
    // this.router.navigate(['/navbar/login']);
  }
}
