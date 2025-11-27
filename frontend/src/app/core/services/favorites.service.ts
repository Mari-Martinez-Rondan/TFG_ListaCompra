import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private keyBase = 'favorites';

  constructor(private tokenService: TokenService) {}

  // Método para obtener la clave de almacenamiento local para el usuario actual
  private getKey(): string {
    const user = this.tokenService.getUsername() ?? 'anon';
    return `${this.keyBase}_${user}`;
  }

  // Obtiene la lista de favoritos del usuario actual
  getFavorites(): string[] {
    try {
      const raw = localStorage.getItem(this.getKey());
      if (!raw) return [];
      return JSON.parse(raw) as string[];
    } catch (e) {
      return [];
    }
  }

  // Método para verificar si está en favoritos
  isFavorite(key: string): boolean {
    return this.getFavorites().includes(key);
  }

  // Método para alternar el estado de favorito
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

  // Método para eliminar de favoritos
  removeFavorite(key: string): void {
    const favs = this.getFavorites();
    const idx = favs.indexOf(key);
    if (idx >= 0) {
      favs.splice(idx, 1);
      localStorage.setItem(this.getKey(), JSON.stringify(favs));
    }
  }

  // Método para eliminar todos los favoritos del usuario actual
  clearFavorites(): void {
    localStorage.removeItem(this.getKey());
  }
}
