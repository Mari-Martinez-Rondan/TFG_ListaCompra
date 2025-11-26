import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly key = 'auth_token';

  setToken(token: string): void {
    localStorage.setItem(this.key, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.key);
  }

  removeToken(): void {
    localStorage.removeItem(this.key);
  }

  /**
   * Decode JWT payload (without verifying) and return object, or null on error
   */
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

  isTokenExpired(token?: string | null): boolean {
    const t = token ?? this.getToken();
    if (!t) return true;
    const payload = this.decodePayload(t);
    if (!payload || !payload.exp) return false; // unknown exp -> assume valid
    // exp is in seconds since epoch
    const nowSec = Math.floor(Date.now() / 1000);
    return payload.exp <= nowSec;
  }

  isLoggedIn(): boolean {
    const t = this.getToken();
    return t !== null && !this.isTokenExpired(t);
  }

  /**
   * Return the username (subject) from the stored token, or null if not available.
   */
  getUsername(): string | null {
    const t = this.getToken();
    if (!t) return null;
    const payload = this.decodePayload(t);
    return payload && payload.sub ? payload.sub : null;
  }

  /**
   * Try to extract a numeric user id from the token payload.
   * Returns null if not present or not a number.
   */
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
