import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '../../services/General.service';
import { AuthService } from '../../services/auth.service';
import { ContactosService } from '../../services/contactos.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

// const { Geolocation } = Plugins;

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
      latitude: [''], // Campo para latitud
      longitude: [''], // Campo para longitud
    });
    this.isLargeScreen = this.platform.width() >= 765;
  }

  async ngOnInit() {
    this.fetchCountries(); //manda llamar api de paises
    this.user = this.authService.getUserFromStorage();
    this.userId = this.user.id;

    try {
      const { latitude, longitude } = await this.getLocation();
      console.log('Ubicación obtenida:', latitude, longitude);
      const msj = 'Lat = ' + latitude + ' Long = ' + longitude ;
      const color = 'rgb(8, 238, 12)';
      // await this.generalService.mostrarAlerta(msj, color);
    } catch (error) {
      await this.generalService.mostrarAlerta('No se pudo obtener la ubicación. Verifica los permisos.', 'rgb(255, 5, 5)');
    }
    
  }
  
  async getLocation(): Promise<{ latitude: number; longitude: number }> {
    if (Capacitor.isNativePlatform()) {
      try {
        // Solicitar permisos en plataformas nativas
        const permissionStatus = await Geolocation.requestPermissions();
        if (permissionStatus.location === 'granted') {
          // Obtener ubicación
          const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true, // Precisión alta
          });
          return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } else {
          console.error('Permisos de geolocalización denegados.');
          return { latitude: 0, longitude: 0 }; // Valores predeterminados
        }
      } catch (error) {
        console.error('Error obteniendo la ubicación:', error);
        return { latitude: 0, longitude: 0 }; // Valores predeterminados
      }
    } else {
      // Usar la API de Geolocalización de HTML5 para la web
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.error('Error obteniendo la ubicación:', error);
              resolve({ latitude: 0, longitude: 0 }); // Valores predeterminados
            },
            { enableHighAccuracy: true, timeout: 10000 }
          );
        } else {
          console.error('Geolocalización no soportada por el navegador.');
          resolve({ latitude: 0, longitude: 0 }); // Valores predeterminados
        }
      });
    }
  }


  // ☢️ Enviara el form
  async onSubmit() {
    if (this.contactForm.valid) {
      // Obtén la ubicación del dispositivo
      const { latitude, longitude } = await this.getLocation();

      // agrega el id del usuario
      this.contactForm.patchValue({
        userId: this.userId, //id user
        contri: this.selectedPhoneCode, // códígo pais
        latitude,
        longitude,
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

  //☢️ Checa el tamaño de la pantalla
  checkScreenSize() {
    this.isLargeScreen = this.platform.width() >= 765;
  }

  //☢️ Api de Contries
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
