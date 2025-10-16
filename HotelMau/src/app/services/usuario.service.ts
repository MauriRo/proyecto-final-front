import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

interface UsuarioRequest {
  username: string;
  password: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = 'http://localhost:9000/admin';

  constructor(private http: HttpClient, private authService: AuthService) {}

  crearUsuario(usuario: UsuarioRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios`, usuario, {
      headers: this.authService.getAuthHeaders()
    });
  }

  listarUsuarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
