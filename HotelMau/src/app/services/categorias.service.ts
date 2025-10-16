import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { CategoriaRequest, CategoriaResponse } from '../models/Categoria.model';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private apiUrl: string = environment.apiUrl + 'categorias/';

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<CategoriaResponse[]> {
    return this.http.get<CategoriaResponse[]>(this.apiUrl).pipe(
      map(categorias => categorias.sort()),
      catchError(error => {
        console.error('Error al obtener las categorías', error);
        return of([]);
      })
    );
  }

  postCategoria(categoria: CategoriaRequest): Observable<CategoriaResponse> {
    return this.http.post<CategoriaResponse>(this.apiUrl, categoria).pipe(
      catchError(error => {
        console.error('Error al registrar la categoría', error);
        throw error;
      })
    );
  }

  putCategoria(categoria: CategoriaRequest, categoriaId: number): Observable<CategoriaResponse> {
    return this.http.put<CategoriaResponse>(`${this.apiUrl}${categoriaId}`, categoria).pipe(
      catchError(error => {
        console.error('Error al actualizar la categoría', error);
        throw error;
      })
    );
  }

  deleteCategoria(categoriaId: number): Observable<CategoriaResponse> {
    return this.http.delete<CategoriaResponse>(`${this.apiUrl}${categoriaId}`).pipe(
      catchError(error => {
        console.error('Error al eliminar la categoría', error);
        throw error;
      })
    );
  }
}
