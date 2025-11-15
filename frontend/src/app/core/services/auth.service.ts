import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, tap } from "rxjs";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService
  ) {}

  /** LOGIN */
  login(credentials: { usuario: string; contrasena: string }): Observable<any> {
    return this.apiService.postData('/auth/login', credentials).pipe(
      tap(response => {
        if (response.token) {
          this.tokenService.setToken(response.token);
        }
      })
    );
  }

  /** LOGOUT */
  logout(): void {
    this.tokenService.removeToken();
  }

  /* REGISTER */
  register(data: { nombreUsuario: string; nombre: string; apellido1: string; apellido2: string | null; telefono: string | null; email: string; contrasena: string }): Observable<any> {
    return this.apiService.postData('/auth/register', data);
  }
}
