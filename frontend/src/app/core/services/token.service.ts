import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly key = 'auth_token';

  setToken(token: string): void {
    localStorage.setItem(this.key, token);
  }

  getToken(): string | null {
    const t = localStorage.getItem(this.key);
    if (!t || t === 'null' || t === 'undefined') return null;
    return t;
  }

  removeToken(): void {
    localStorage.removeItem(this.key);
  }

  // Codificar la carga útil del JWT (sin verificar) y devolver el objeto, o null en caso de error
  private decodePayload(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (e) {
      return null;
    }
  }

  // Comprobar si el token ha expirado
  isTokenExpired(token?: string | null): boolean {
    const t = token ?? this.getToken();
    if (!t) return true;
    const payload = this.decodePayload(t);
    if (!payload || !payload.exp) return false;
    const nowSec = Math.floor(Date.now() / 1000);
    return payload.exp <= nowSec;
  }

  // Verificar si el usuario está autenticado (token presente y no expirado)
  isLoggedIn(): boolean {
    const t = this.getToken();
    return t !== null && !this.isTokenExpired(t);
  }
// Método para extraer el nombre de usuario del token
  getUsername(): string | null {
    const t = this.getToken();
    if (!t) return null;
    const payload = this.decodePayload(t);
    return payload && payload.sub ? payload.sub : null;
  }

 // Método para extraer el ID de usuario del token
  getUserId(): number | null {
    const t = this.getToken();
    if (!t) return null;
    const payload = this.decodePayload(t);
    if (!payload) return null;
    const candidate = payload.id ?? payload.userId ?? payload.user_id ?? null;
    if (candidate == null) return null;
    const n = Number(candidate);
    return isNaN(n) ? null : n;
  }
}
