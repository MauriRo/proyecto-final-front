import { Injectable } from '@angular/core';
import { AuthRequest, AuthResponse, JwtPayload } from '../models/Auth.model';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { JwtHelper } from '../shared/jwt.helper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getAuthHeaders(): import("@angular/common/http").HttpHeaders | Record<string, string | string[]> | undefined {
      throw new Error('Method not implemented.');
  }
  private authUrl: string = environment.authUrl;
  private tokenKey: string = 'auth-token';
  private payload: JwtPayload | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.decodeToken(); // Hay que decodificar el token al iniciarl el servicio
  }

  login(username: string, password: string) {
    let authRequest: AuthRequest = { username, password };
    return this.http.post<AuthResponse>(this.authUrl, authRequest).pipe(
      tap(response => {
        if (response?.token) {
          localStorage.setItem(this.tokenKey, response.token);
          this.decodeToken();
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !JwtHelper.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.payload = null;
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // ------------------------
  // Funciones de roles y usuario
  // ------------------------

  private decodeToken(): void {
    const token = this.getToken();
    this.payload = token ? JwtHelper.decodeToken(token) : null;
  }

  getUsername(): string | null {
    return this.payload?.sub || null;
  }

  getRoles(): string[] {
    return this.payload?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }
}
