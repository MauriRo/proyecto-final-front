import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { HabitacionRequest, HabitacionResponse } from '../models/habitacion.models';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {
  private apiUrl = environment.apiHabitaciones;

  constructor(private http: HttpClient) { }

  getHabitaciones(): Observable<HabitacionResponse[]> {
    return this.http.get<HabitacionResponse[]>(this.apiUrl).pipe(
      map(habs => habs.sort((a, b) => a.numero - b.numero)),
      catchError(error => {
        console.error('Error al obtener habitaciones', error);
        return of([]);
      })
    );
  }

  postHabitacion(habitacion: HabitacionRequest): Observable<HabitacionResponse> {
    return this.http.post<HabitacionResponse>(this.apiUrl, habitacion).pipe(
      catchError(error => {
        console.error('Error al crear habitación', error);
        throw error;
      })
    );
  }

  putHabitacion(habitacion: HabitacionRequest, id: number): Observable<HabitacionResponse> {
    return this.http.put<HabitacionResponse>(`${this.apiUrl}/${id}`, habitacion).pipe(
      catchError(error => {
        console.error('Error al actualizar habitación', error);
        throw error;
      })
    );
  }

  deleteHabitacion(id: number): Observable<HabitacionResponse> {
    return this.http.delete<HabitacionResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar habitación', error);
        throw error;
      })
    );
  }
}

