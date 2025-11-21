import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ProductoSupermercado } from '../models/ProductoSupermercado';

@Injectable({
  providedIn: 'root'
})
export class ProductoSupermercadoService {
    
private apiUrl = `${environment.apiUrl}/productos-supermercados`;

  constructor(private http: HttpClient) {}

  getSuperManolo(): Observable<ProductoSupermercado[]> {
    if (environment.useMocks) {
      return this.http.get<ProductoSupermercado[]>('http://localhost:3001/productos');
    }
    return this.http.get<ProductoSupermercado[]>(`${this.apiUrl}/supermanolo`);
  }

  getSuperPepe(): Observable<ProductoSupermercado[]> {
    if (environment.useMocks) {
      return this.http.get<ProductoSupermercado[]>('http://localhost:3000/productos');
    }
    return this.http.get<ProductoSupermercado[]>(`${this.apiUrl}/superpepe`);
  }

  getTodos(): Observable<ProductoSupermercado[]> {
    // If useMocks is enabled, getSuperManolo/getSuperPepe already point to mocks
    return forkJoin({
      manolo: this.getSuperManolo(),
      pepe: this.getSuperPepe()
    }).pipe(
      map(({ manolo, pepe }) => ([... (manolo ?? []), ... (pepe ?? [])])),
      catchError(err => {
        // If backend rejects due to auth (403) and mocks were NOT enabled, try local json-server mocks as a fallback
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
