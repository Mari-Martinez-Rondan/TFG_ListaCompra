import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { ListaService, ListaItem } from '../../../../core/services/lista.service';
import { ListaApiService } from '../../../../core/services/lista-api.service';
import { TokenService } from '../../../../core/services/token.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: "app-lista-view",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./listaview.html",
  styleUrls: ["./listaview.css"]
})
export class ListaViewComponent {
  items: ListaItem[] = [];
  listas: { id: string; name: string }[] = [];
  activeListId?: string;

  constructor(private listaService: ListaService,
              private notificationService: NotificationService,
              private apiListas: ListaApiService,
              private tokenService: TokenService) {
    this.refreshLists();
    this.refresh();
  }

  refreshLists(): void {
    // Load lists from the server for the authenticated user
    this.apiListas.obtenerMisListas().subscribe({
      next: (res) => {
        // API response received
        // Expecting an array of lists with { id, nombre } or similar
        // Apply an extra client-side safety filter: if the server returns user info,
        // only keep lists that belong to the current authenticated user. This
        // protects against server misconfiguration returning global lists.
        const username = this.tokenService.getUsername();
        const userId = this.tokenService.getUserId();
        let incoming = (res || []) as any[];
        // Prefer explicit owner fields if provided by the server (usuarioId or usuario)
        incoming = incoming.filter(l => {
          // If server provided a numeric owner id, prefer numeric match
          if (l.usuarioId != null) {
            if (userId != null) {
              return Number(l.usuarioId) === userId;
            }
            // token has no numeric id: try matching by provided usuarioNombre
            if (l.usuarioNombre && username) return String(l.usuarioNombre) === username;
            return false;
          }

          // If server provided a nested usuario object, try its fields
          if (l.usuario) {
            const u = l.usuario as any;
            if (u.id != null && userId != null) return Number(u.id) === userId;
            if (u.nombreUsuario && username) return String(u.nombreUsuario) === username;
            if (u.username && username) return String(u.username) === username;
            return false;
          }

          // If the server provided a top-level usuarioNombre, match by username
          if (l.usuarioNombre && username) return String(l.usuarioNombre) === username;

          // If server did not include owner info, drop the entry for safety.
          return false;
        });

        this.listas = incoming.map((l: any) => ({ id: String(l.id), name: l.nombre || l.name || ('Lista ' + l.id) }));
        // keep current active list if present, otherwise set from service
        this.activeListId = this.listaService.getActiveListId() || (this.listas.length ? this.listas[0].id : undefined);
      },
      error: (err) => {
        console.error('Error cargando listas desde API:', err);
        // fallback to local lists
        this.listas = this.listaService.getLists().map(l => ({ id: l.id, name: l.name }));
        this.activeListId = this.listaService.getActiveListId();
      }
    });
  }

  selectList(id: string | undefined): void {
    if (!id) return;
    this.listaService.setActiveList(id);
    this.activeListId = id;
    this.refresh();
  }

  createListPrompt(): void {
    const name = window.prompt('Nombre de la nueva lista:', 'Nueva lista');
    if (name && name.trim().length > 0) {
      // Create via API
      this.apiListas.crearLista(name.trim()).subscribe({
        next: (nueva) => {
          // server should return the created list with id
          const nuevaId = String(nueva?.id ?? nueva?.Id ?? nueva);
          const nuevaName = nueva?.nombre || nueva?.name || name.trim();
          // update local lists and active selection
          this.listas.push({ id: nuevaId, name: nuevaName });
          this.listaService.setActiveList(nuevaId);
          this.activeListId = nuevaId;
          this.refresh();
          this.notificationService.show(`Lista "${nuevaName}" creada`);
        },
        error: (err) => {
          console.error('Error creando lista en API:', err);
          this.notificationService.show('Error al crear la lista');
        }
      });
    }
  }

  refresh(): void {
    this.items = this.listaService.getItems();
  }

  /**
   * Parse a price string like "1,23 €" or "1.23€" into a number (euros).
   */
  precioNumerotico(precio: string): number {
    if (!precio) return 0;
    const cleaned = precio.replace(/€/g, '').replace(/\s+/g, '').replace(',', '.');
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  }

  /** subtotal for a line item */
  itemSubtotal(it: ListaItem): number {
    return this.precioNumerotico(it.producto.precio) * (it.cantidad || 0);
  }

  /** grand total for the list */
  grandTotal(): number {
    return this.items.reduce((sum, it) => sum + this.itemSubtotal(it), 0);
  }

  /** format number to euro string (2 decimals, comma decimal separator) */
  formatEuro(value: number): string {
    return value === Infinity ? '—' : value.toFixed(2).replace('.', ',') + ' €';
  }

  remove(id: number): void {
    this.listaService.removeProducto(id);
    this.notificationService.show('Producto eliminado de la lista');
    this.refresh();
  }

  clear(): void {
    this.listaService.clear();
    this.notificationService.show('Lista vaciada');
    this.refresh();
  }

  increase(it: ListaItem): void {
    const nueva = (it.cantidad || 0) + 1;
    this.listaService.updateCantidad(it.producto.id, nueva);
    this.refresh();
  }

  decrease(it: ListaItem): void {
    const nueva = (it.cantidad || 0) - 1;
    this.listaService.updateCantidad(it.producto.id, nueva);
    this.refresh();
  }

  setQuantity(it: ListaItem, value: string | number): void {
    const n = typeof value === 'number' ? value : parseInt(String(value), 10);
    const nueva = isNaN(n) ? 0 : n;
    this.listaService.updateCantidad(it.producto.id, nueva);
    this.refresh();
  }

  deleteActiveList(): void {
    if (!this.activeListId) return;
    const meta = this.listas.find(l => l.id === this.activeListId);
    const name = meta ? meta.name : 'lista';
    const confirmed = window.confirm(`¿Eliminar la lista "${name}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    // Delete via API and then refresh
    this.apiListas.eliminarLista(Number(this.activeListId)).subscribe({
      next: () => {
        this.notificationService.show(`Lista "${name}" eliminada`);
        // Optionally remove from local service too
        if (this.activeListId) {
          this.listaService.deleteList(this.activeListId);
        }
        this.refreshLists();
        this.refresh();
      },
      error: (err) => {
        console.error('Error eliminando lista en API:', err);
        this.notificationService.show('Error al eliminar la lista');
      }
    });
  }
}