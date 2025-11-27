import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:8080/api/perfil';
    constructor(private http: HttpClient) {}

    //Metodo para obtener el perfil del usuario
    obtenerPerfil(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    //Metodo para actualizar el perfil del usuario
    actualizarPerfil(perfilData: any): Observable<any> {
        return this.http.put(this.apiUrl, perfilData);
    }

    //Metodo para cambiar la contraseña del usuario
    cambiarContrasena(contrasenaData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/contrasena`, contrasenaData);
    }

}