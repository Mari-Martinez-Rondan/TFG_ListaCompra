import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private keyBase = 'favorites';

  constructor(private tokenService: TokenService) {}

  private getKey(): string {
    const user = this.tokenService.getUsername() ?? 'anon';
    return `${this.keyBase}_${user}`;
  }

  // Store composite keys (string) to disambiguate products from different supermarkets
  getFavorites(): string[] {
    try {
      const raw = localStorage.getItem(this.getKey());
      if (!raw) return [];
      return JSON.parse(raw) as string[];
    } catch (e) {
      return [];
    }
  }

  isFavorite(key: string): boolean {
    return this.getFavorites().includes(key);
  }

  toggleFavorite(key: string): boolean {
    const favs = this.getFavorites();
    const idx = favs.indexOf(key);
    if (idx >= 0) {
      favs.splice(idx, 1);
    } else {
      favs.push(key);
    }
    localStorage.setItem(this.getKey(), JSON.stringify(favs));
    return idx < 0; // true if now added
  }

  removeFavorite(key: string): void {
    const favs = this.getFavorites();
    const idx = favs.indexOf(key);
    if (idx >= 0) {
      favs.splice(idx, 1);
      localStorage.setItem(this.getKey(), JSON.stringify(favs));
    }
  }

  clearFavorites(): void {
    localStorage.removeItem(this.getKey());
  }
}
