import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, tap } from "rxjs";
import { TokenService } from "./token.service";
import { ListaService } from './lista.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService,
    private listaService: ListaService
  ) {}

  // Método para login
  login(credentials: { nombreUsuario: string; contrasena: string }): Observable<any> {
    return this.apiService.postData('/auth/login', credentials).pipe(
      tap((response: any) => {
        if (response && response.token ) {
          this.tokenService.setToken(response.token);
          // Refrescar el servicio de lista para el usuario actual
          try { this.listaService.refreshForCurrentUser(); } catch (e) {}
          return;
        }

        // Si se está ejecutando con mocks o el backend no devolvió un token, crear un token falso
        if (environment.useMocks && credentials && credentials.nombreUsuario) {
          const fake = this.buildFakeToken(credentials.nombreUsuario);
          this.tokenService.setToken(fake);
          try { this.listaService.refreshForCurrentUser(); } catch (e) {}
        }
      })
    );
  }

  // Método para construir un token falso
  private buildFakeToken(username: string): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    // establecer la expiración a 30 días a partir de ahora (en segundos)
    const exp = now + 30 * 24 * 60 * 60;
    const payload = { sub: username, iat: now, exp };

    const toBase64Url = (obj: any) => {
      const str = JSON.stringify(obj);
      const b64 = btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      return b64;
    };

    const headerB = toBase64Url(header);
    const payloadB = toBase64Url(payload);
    // La firma es un marcador de posición ya que solo usamos la carga útil del lado del cliente
    const signature = 'fake-signature';
    return `${headerB}.${payloadB}.${signature}`;
  }

  // Método para logout
  logout(): void {
    this.tokenService.removeToken();
    try { this.listaService.refreshForCurrentUser(); } catch (e) {}
  }

  // Método para registro
 register(playload: any): Observable<any> {
    // El backend devuelve un mensaje de texto plano en caso de registro exitoso.
    // Solicitar responseType 'text' para evitar errores de análisis JSON de HttpClient.
    return this.apiService.postData('/auth/register', playload, { responseType: 'text' as 'json' });
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.tokenService.isLoggedIn();
  }
}
