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
        apellido_p: ['', Validators.required],
        apellido_m: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telefon: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Validación de teléfono
        pass: ['', [Validators.required, this.passwordValidator]],
        confirm_pass: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    console.log('hola - registro');
  }

  nextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  // Validador personalizado para la contraseña
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(control.value) ? null : { passwordInvalid: true };
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Validación para que las contraseñas coincidan
  passwordMatchValidator(group: FormGroup) {
    const pass = group.get('pass')?.value;
    const confirmPass = group.get('confirm_pass')?.value;
    return pass === confirmPass ? null : { passwordsMismatch: true };
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
    // Muestrar un loading
    await this.generalService.presentLoading();

    this.authService.register(this.registerForm.value).subscribe({
      next: async (response) => {
        await this.generalService.dismissLoading();
        const msj = response?.msj || 'Login exitoso';
        const header = 'Success ✅';
        this.generalService.showErrorAlert(msj, header);

        setTimeout(() => {
          window.location.href = '/navbar/home';
          // this.router.navigate(['/navbar/home']);
        }, 2000);
      },
      error: async (error) => {
        await this.generalService.dismissLoading();
        const msj =
          error?.error?.msj || error?.message || 'Ocurrió un error inesperado.';
        const header = 'Error ❌';
        this.generalService.showErrorAlert(msj, header);
      },
    });
  }
}
