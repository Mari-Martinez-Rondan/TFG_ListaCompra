import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:8080/api/perfil';
    constructor(private http: HttpClient) {}

    // Do not attach Authorization header here (it may create 'Bearer null').
    // The `authInterceptor` will add the header when a token exists.
    obtenerPerfil(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    actualizarPerfil(perfilData: any): Observable<any> {
        return this.http.put(this.apiUrl, perfilData);
    }

    cambiarContrasena(contrasenaData: any): Observable<any> {
        // Note: backend expects PUT at /contrasena (see PerfilController).
        return this.http.put(`${this.apiUrl}/contrasena`, contrasenaData);
    }

}