import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { GeneralService } from '../../services/General.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  loading!: HTMLIonLoadingElement;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private generalService: GeneralService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    console.log('holaaa!');
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      await this.generalService.presentLoading();

      this.authService.login(email, password).subscribe({
        next: async () => {
          await this.generalService.dismissLoading();
          // this.router.navigate(['/star/home']);
          window.location.href = '/navbar/home';
        },
        error: async (error) => {
          const msj =
            error?.error?.msj ||
            error?.message ||
            'Ocurrió un error inesperado.';
          const color = 'rgb(255, 5, 5)';
          await this.generalService.mostrarAlerta(msj, color);

          await this.generalService.dismissLoading();
        },
      });
    } else {
      this.generalService.showErrorAlert(
        'Por favor, completa todos los campos correctamente.',
        'Formulario Incompleto'
      );
    }
  }
  // Mostrar u ocultar la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
