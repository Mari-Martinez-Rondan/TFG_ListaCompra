import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListaApiService {
  private apiUrl = `${environment.apiUrl}/listas`;
    constructor(private http: HttpClient) {}

    // Obtener listas del usuario autenticado
    obtenerMisListas(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    // Crear una nueva lista
    crearLista(nombre: String): Observable<any> {
        return this.http.post(this.apiUrl, { nombre });
    }

    // Eliminar una lista por ID
    eliminarLista(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}