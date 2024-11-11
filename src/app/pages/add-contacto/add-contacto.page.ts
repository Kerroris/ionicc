import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '../../services/General.service';
import { AuthService } from '../../services/auth.service';
import { ContactosService } from '../../services/contactos.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-contacto',
  templateUrl: './add-contacto.page.html',
  styleUrls: ['./add-contacto.page.scss'],
})
export class AddContactoPage implements OnInit {
  countries: any[] = [];
  selectedPhoneCode: string | null = null;
  selectedCountry: any;

  contactForm: FormGroup;
  selectedImage: string | null = null;
  user: any;
  userId: number | null = null;
  public isLargeScreen: boolean;

  constructor(
    private fb: FormBuilder,
    private generalService: GeneralService,
    private authService: AuthService,
    private contactosService: ContactosService,
    private platform: Platform,
    private http: HttpClient,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: [''],
      telefon: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.email]],
      img: [''],
      direccion: [''],
      nota: [''],
      userId: [''],
      contri: [''],
    });
    this.isLargeScreen = this.platform.width() >= 765;
  }

  ngOnInit() {
    this.fetchCountries(); //manda llamar api de paises
    this.user = this.authService.getUserFromStorage();
    this.userId = this.user.id;
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      // agrega el id del usuario
      this.contactForm.patchValue({
        userId: this.userId,
        contri: this.selectedPhoneCode
      });

      //mostrar loadingg
      await this.generalService.presentLoading();

      this.contactosService.insertContacto(this.contactForm.value).subscribe({
        next: async (response) => {
          await this.generalService.dismissLoading();
          const msj = response?.msj || 'success';
          const color = 'rgb(8, 238, 12)';
          await this.generalService.mostrarAlerta(msj, color);
          // Limpiar el formulario
          this.contactForm.reset();
          this.router.navigate(['/navbar/home']);
        },
        error: async (error) => {
          await this.generalService.dismissLoading();
          const msj =
            error?.error?.msj ||
            error?.message ||
            'Ocurrió un error inesperado.';
          const color = 'rgb(255, 5, 5)';
          await this.generalService.mostrarAlerta(msj, color);
        },
      });
    } else {
      const msj = 'Ocurrió un error inesperado.';
      const color = 'rgb(255, 5, 5)';
      await this.generalService.mostrarAlerta(msj, color);
    }
  }

  //☢️ Función para seleccionar imagen
  async selectImage() {
    const actionSheet = document.createElement('ion-action-sheet');
    actionSheet.header = 'Seleccionar Imagen';
    actionSheet.buttons = [
      {
        text: 'Tomar Foto',
        handler: () => {
          this.takePhoto();
        },
      },
      {
        text: 'Elegir de Galería',
        handler: () => {
          this.selectFromGallery();
        },
      },
      {
        text: 'Cancelar',
        role: 'cancel',
      },
    ];
    document.body.appendChild(actionSheet);
    await actionSheet.present();
  }

  //☢️ Función para tomar foto
  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true, //editar la imagen después de tomarla
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    this.selectedImage = image.dataUrl || null;
    this.contactForm.patchValue({ img: this.selectedImage });
  }

  //☢️ Función para seleccionar de galería
  async selectFromGallery() {
    const image = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });
    this.selectedImage = image.dataUrl || null;
    this.contactForm.patchValue({ img: this.selectedImage });
  }

  checkScreenSize() {
    this.isLargeScreen = this.platform.width() >= 765;
  }

  async fetchCountries() {
    this.http
      .get<any[]>('https://restcountries.com/v3.1/all')
      .subscribe((data) => {
        this.countries = data
          .map((country) => ({
            name: country.name.common,
            phoneCode:
              (country.idd.root || '') +
              (country.idd.suffixes ? country.idd.suffixes[0] : ''),
            flag: country.flags.png,
          }))
          .filter((country) => country.phoneCode);
        const mexico = this.countries.find(
          (country) => country.name === 'Mexico'
        );
        this.selectedCountry = mexico; // mxico como el valor selecionad
        // console.log(mexico.phoneCode);
        this.selectedPhoneCode = mexico.phoneCode; // codigo de telefono de mexico
      });
  }

  onCountryChange(event: any) {
    this.selectedCountry = event.detail.value; // Cambiar la seleccion del pais
    this.selectedPhoneCode = this.selectedCountry.phoneCode; // Actualizar el codigo telefonico
  }
}
