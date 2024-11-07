import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //  'BehaviorSubject' = es un tipo especial de observable en RxJS.
  //      Siempre mantiene el último valor emitido.
  //      Permite que cualquier suscriptor obtenga el valor más reciente automáticamente.
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token') && !!localStorage.getItem('user');
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };

    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/p-login`, body)
      .pipe(
        tap((response) => {
          this.guardaStorage(response);
        })
      );
  }

  // isLoggedIn(): boolean {
  //   return this.hasToken();
  // }

  guardaStorage(response: any){
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  // ☢️ Método varificar si estoy autenticado
  verifisLogged(): boolean {
    const isAuthenticated = this.hasToken();
    this.isLoggedInSubject.next(isAuthenticated); 
    return isAuthenticated;
  }

  // Función para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  register(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/p-register`, data)
    .pipe(
      tap((response) => {
        this.guardaStorage(response);
      })
    );
  }
}
