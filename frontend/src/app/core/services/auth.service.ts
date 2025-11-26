import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, tap } from "rxjs";
import { TokenService } from "./token.service";
import { ListaService } from './lista.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService,
    private listaService: ListaService
  ) {}

  /** LOGIN */
  login(credentials: { nombreUsuario: string; contrasena: string }): Observable<any> {
    return this.apiService.postData('/auth/login', credentials).pipe(
      tap((response: any) => {
        if (response && response.token ) {
          this.tokenService.setToken(response.token);
          // refresh lists for the newly authenticated user
          try { this.listaService.refreshForCurrentUser(); } catch (e) {}
          return;
        }

        // If running with mocks or backend didn't return a token, create a fake token
        if (environment.useMocks && credentials && credentials.nombreUsuario) {
          const fake = this.buildFakeToken(credentials.nombreUsuario);
          this.tokenService.setToken(fake);
          try { this.listaService.refreshForCurrentUser(); } catch (e) {}
        }
      })
    );
  }

  private buildFakeToken(username: string): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    // set expiration to 30 days from now (in seconds)
    const exp = now + 30 * 24 * 60 * 60;
    const payload = { sub: username, iat: now, exp };

    const toBase64Url = (obj: any) => {
      const str = JSON.stringify(obj);
      const b64 = btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      return b64;
    };

    const headerB = toBase64Url(header);
    const payloadB = toBase64Url(payload);
    // Signature is a placeholder since we only use the payload client-side
    const signature = 'fake-signature';
    return `${headerB}.${payloadB}.${signature}`;
  }

  /** LOGOUT */
  logout(): void {
    this.tokenService.removeToken();
    try { this.listaService.refreshForCurrentUser(); } catch (e) {}
  }

  /* REGISTER 
  register(data: { nombreUsuario: string; nombre: string; apellido1: string; apellido2: string | null; telefono: string | null; email: string; contrasena: string }): Observable<any> {
    return this.apiService.postData('/auth/register', data);
  }*/
 register(playload: any): Observable<any> {
    // The backend returns a plain text message on successful registration.
    // Request responseType 'text' to avoid HttpClient JSON parse errors.
    return this.apiService.postData('/auth/register', playload, { responseType: 'text' as 'json' });
  }

  /* CHECK AUTHENTICATION */
  isAuthenticated(): boolean {
    return this.tokenService.isLoggedIn();
  }
}
