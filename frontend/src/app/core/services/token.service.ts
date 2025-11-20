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

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
