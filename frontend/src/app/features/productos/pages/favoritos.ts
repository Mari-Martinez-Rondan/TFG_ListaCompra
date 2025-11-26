import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListadoProductosComponent } from './listadoProductos';
import { FavoritesService } from '../../../core/services/favorites.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, ListadoProductosComponent],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="mb-0">Productos Favoritos</h2>
        <div>
          <button *ngIf="favoritesCount > 0" class="btn btn-sm btn-outline-danger" (click)="clearAllFavorites()">Eliminar todos</button>
        </div>
      </div>

      <div *ngIf="favoritesCount === 0" class="alert alert-info">No tienes productos favoritos todavía.</div>

      <app-listado-productos [onlyFavorites]="true" [showHeader]="false" [showFavoritesToggle]="false"></app-listado-productos>
    </div>
  `,
})
export class FavoritosComponent {
  constructor(private favoritesService: FavoritesService, private notificationService: NotificationService) {}

  get favoritesCount(): number {
    return this.favoritesService.getFavorites().length;
  }

  clearAllFavorites(): void {
    const ok = window.confirm('¿Deseas eliminar todos los productos favoritos?');
    if (!ok) return;
    this.favoritesService.clearFavorites();
    this.notificationService.show('Todos los favoritos han sido eliminados');
  }
}
