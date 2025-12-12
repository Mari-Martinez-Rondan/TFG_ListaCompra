import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoApiService {
  private apiUrl = `${environment.apiUrl}/productos`;
    constructor(private http: HttpClient) {}

    // Añadir un producto a la lista indicada (usa el endpoint backend: POST /api/productos/lista/{listaId}/productos)
    agregarProductoALista(listaId: number, producto: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/lista/${listaId}/productos`, producto);
    }

    // Método para crear un nuevo producto en una lista de compra
    crearProducto(listaId: number, productoData: any): Observable<any> {
        return this.http.post(this.apiUrl, {...productoData, listaCompraId: listaId});
    }

    // Método para obtener productos por lista de compra
    obtenerProductosPorLista(listaId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/lista/${listaId}`);
    }  

    // Método para actualizar un producto existente
    actualizarProducto(productoId: number, productoData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${productoId}`, productoData);
    }

    // Método para eliminar un producto existente
    eliminarProducto(productoId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${productoId}`);
    }
}