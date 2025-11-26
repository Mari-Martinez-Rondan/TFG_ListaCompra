import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent {

  constructor(private favoritesService: FavoritesService) {}

  get favoritesCount(): number {
    return this.favoritesService.getFavorites().length;
  }

}
