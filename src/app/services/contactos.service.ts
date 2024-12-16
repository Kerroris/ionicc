import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root',
})
export class ContactosService {
  constructor(private http: HttpClient) {}

  insertContacto(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/p-insert-contact`, data);
  }

  getContacts(userId: any): Observable<any> {
    const body = { userId };
    return this.http.post(`${environment.apiUrl}/p-get-contactos`, body);
  }

  getContacto(userId: any): Observable<any> {
    const body = { userId };
    return this.http.post(`${environment.apiUrl}/p-get-contacto`, body);
  }
  
  eliminar(Idusers: any): Observable<any> {
    const body = { Idusers };
    return this.http.post(`${environment.apiUrl}/p-delete-contacto`, body);
  }

  

}
