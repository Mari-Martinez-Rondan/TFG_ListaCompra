import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { ListaService, ListaItem } from '../../../../core/services/lista.service';
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

  constructor(private listaService: ListaService, private notificationService: NotificationService) {
    this.refreshLists();
    this.refresh();
  }

  refreshLists(): void {
    this.listas = this.listaService.getLists().map(l => ({ id: l.id, name: l.name }));
    this.activeListId = this.listaService.getActiveListId();
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
      const id = this.listaService.createList(name.trim());
      this.listaService.setActiveList(id);
      this.refreshLists();
      this.refresh();
      this.notificationService.show(`Lista "${name.trim()}" creada`);
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
}