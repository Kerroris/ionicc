import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../services/General.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  currentStep = 1;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group(
      {
        nombre: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        pass: ['', [Validators.required]],
      },
    );
  }

  ngOnInit() {
    console.log('hola - registro');
  }

  // Validador personalizado para la contraseña
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(control.value) ? null : { passwordInvalid: true };
  }

  // Mostrar u ocultar la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // ☢️ Enviar el formulario
  async onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: async (response) => {
        const msj = response?.mensaje || 'Login exitoso';
        const header = 'Success ✅';
        this.generalService.showErrorAlert(msj, header);

        setTimeout(() => {
          window.location.href = '/star/home';
        }, 3000);
      },
      error: async (error) => {
        const msj =
          error?.error?.msj || error?.message || 'Ocurrió un error inesperado.';
        const header = 'Error ❌';
        this.generalService.showErrorAlert(msj, header);
      },
    });
  }
}
