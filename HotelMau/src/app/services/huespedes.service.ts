import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';

import { catchError, map, Observable, of } from 'rxjs';
import { HuespedRequest, HuespedResponse } from '../models/huesped.models';

@Injectable({
  providedIn: 'root'
})
export class HuespedesService {

  private apiUrl: string = environment.apiUrl + '/huespedes';

  constructor(private http: HttpClient) { }

  getHuespedes(): Observable<HuespedResponse[]> {
    return this.http.get<HuespedResponse[]>(this.apiUrl).pipe(
      map(huespedes => huespedes.sort((a, b) => a.id - b.id)),
      catchError(error => {
        console.error('Error al obtener los huéspedes', error);
        return of([]);
      })
    );
  }

  postHuesped(huesped: HuespedRequest): Observable<HuespedResponse> {
    return this.http.post<HuespedResponse>(this.apiUrl, huesped).pipe(
      catchError(error => {
        console.error('Error al registrar el huésped', error);
        throw error;
      })
    );
  }

  putHuesped(huesped: HuespedRequest, id: number): Observable<HuespedResponse> {
    return this.http.put<HuespedResponse>(`${this.apiUrl}/${id}`, huesped).pipe(
      catchError(error => {
        console.error('Error al actualizar el huésped', error);
        throw error;
      })
    );
  }

  deleteHuesped(id: number): Observable<HuespedResponse> {
    return this.http.delete<HuespedResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar el huésped', error);
        throw error;
      })
    );
  }
}
