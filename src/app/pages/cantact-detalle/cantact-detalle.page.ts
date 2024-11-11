import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '../../services/General.service';
import { AuthService } from '../../services/auth.service';
import { ContactosService } from '../../services/contactos.service';
import { Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-cantact-detalle',
  templateUrl: './cantact-detalle.page.html',
  styleUrls: ['./cantact-detalle.page.scss'],
})
export class CantactDetallePage implements OnInit {
  countries: any[] = [];
  selectedPhoneCode: string | null = null;
  selectedCountry: any;
  contactForm: FormGroup;
  selectedImage: string | null = null;
  urlImg: string | undefined;

  
  user: any = {};
  public isLargeScreen: boolean;
  public showForm: boolean = false;
  public contactId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private generalService: GeneralService,
    private authService: AuthService,
    private contactosService: ContactosService,
    private platform: Platform,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: [''],
      telefon: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.email]],
      img: [''],
      direccion: [''],
      nota: [''],
      contri: [''],
    });
    this.isLargeScreen = this.platform.width() >= 765;
  }

  ngOnInit() {
    this.urlImg = environment.urlImg;
    this.showForm = false;
    // Obtén el ID de la URL
    this.contactId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getContacto(this.contactId);
  }

  onSubmit() {}
  mostrarFormulario() {
    this.showForm = true;
  }

  async getContacto(userId: any) {
    //mostrar loadingg
    await this.generalService.presentLoading();

    this.contactosService.getContacto(userId).subscribe({
      next: async (response) => {
        this.user = response.contacto[0] || {};
        console.log(this.user);

        await this.generalService.dismissLoading();

      },
      error: async (error) => {
        await this.generalService.dismissLoading();
        const msj =
          error?.error?.msj || error?.message || 'Ocurrió un error inesperado.';
        const color = 'rgb(255, 5, 5)';
        await this.generalService.mostrarAlerta(msj, color);
      },
    });
  }

  ionViewWillEnter() {

  }

  formatPhoneNumber(phone: string): string {
    if (!phone || phone.length < 10) return phone;
    // Separa los ultimos 10 dígitos para el número principal
    const mainNumber = phone.slice(-10);
    const areaCode = phone.slice(0, phone.length - 10);
    // Formateo del número principal
    const formattedNumber = `${mainNumber.slice(0, 4)} ${mainNumber.slice(4, 7)} ${mainNumber.slice(7)}`;
  
    // Devuelve la lada y el número formateado
    return `${areaCode} ${formattedNumber}`;
  }
  
  
}
