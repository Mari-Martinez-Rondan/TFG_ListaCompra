import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ProductoSupermercado } from '../models/ProductoSupermercado';

@Injectable({
  providedIn: 'root'
})
export class ProductoSupermercadoService {
    
private apiUrl = `${environment.apiUrl}/productos-supermercados`;

  constructor(private http: HttpClient) {}

  // Método para obtener productos de SuperManolo
  getSuperManolo(): Observable<ProductoSupermercado[]> {
    if (environment.useMocks) {
      return this.http.get<ProductoSupermercado[]>('http://localhost:3001/productos');
    }
    return this.http.get<ProductoSupermercado[]>(`${this.apiUrl}/supermanolo`);
  }

  // Método para obtener productos de SuperPepe
  getSuperPepe(): Observable<ProductoSupermercado[]> {
    if (environment.useMocks) {
      return this.http.get<ProductoSupermercado[]>('http://localhost:3000/productos');
    }
    return this.http.get<ProductoSupermercado[]>(`${this.apiUrl}/superpepe`);
  }

  // Método para obtener todos los productos de ambos supermercados
  getTodos(): Observable<ProductoSupermercado[]> {
    // If useMocks is enabled, getSuperManolo/getSuperPepe already point to mocks
    return forkJoin({
      manolo: this.getSuperManolo(),
      pepe: this.getSuperPepe()
    }).pipe(
      map(({ manolo, pepe }) => ([... (manolo ?? []), ... (pepe ?? [])])),
      catchError(err => {
        // Si el backend rechaza por autenticación (403) y los mocks NO estaban habilitados, intentar mocks locales de json-server como respaldo
        console.warn('getTodos failed against backend', err);
        if (!environment.useMocks && err?.status === 403) {
          const manoloUrl = 'http://localhost:3001/productos';
          const pepeUrl = 'http://localhost:3000/productos';
          return forkJoin({
            manolo: this.http.get<ProductoSupermercado[]>(manoloUrl),
            pepe: this.http.get<ProductoSupermercado[]>(pepeUrl)
          }).pipe(
            map(({ manolo, pepe }) => ([... (manolo ?? []), ... (pepe ?? [])]))
          );
        }

        return throwError(() => err);
      })
    );
  }
}
