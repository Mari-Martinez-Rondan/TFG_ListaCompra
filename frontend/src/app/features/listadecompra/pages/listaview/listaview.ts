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

  // Refrescar la lista de listas disponibles para el usuario autenticado
  refreshLists(): void {
    // Cargar listas desde el servidor para el usuario autenticado
    this.apiListas.obtenerMisListas().subscribe({
      next: (res) => {
        //Respuesta de la API recibida
        // Esperando un array de listas con { id, nombre } o similar
        // Aplicar un filtro de seguridad adicional del lado del cliente: si el servidor devuelve información del usuario,
        // solo conservar las listas que pertenecen al usuario autenticado actual. Esto
        // protege contra una mala configuración del servidor que devuelva listas globales.
        const username = this.tokenService.getUsername();
        const userId = this.tokenService.getUserId();
        let incoming = (res || []) as any[];
        // Preferir campos explícitos de propietario si los proporciona el servidor (usuarioId o usuario)
        incoming = incoming.filter(l => {
          // Si el servidor proporcionó un id numérico de propietario, preferir la coincidencia numérica
          if (l.usuarioId != null) {
            if (userId != null) {
              return Number(l.usuarioId) === userId;
            }
            // el token no tiene id numérico: intentar coincidir por usuarioNombre proporcionado
            if (l.usuarioNombre && username) return String(l.usuarioNombre) === username;
            return false;
          }

          // Si el servidor proporcionó un objeto usuario anidado, probar sus campos
          if (l.usuario) {
            const u = l.usuario as any;
            if (u.id != null && userId != null) return Number(u.id) === userId;
            if (u.nombreUsuario && username) return String(u.nombreUsuario) === username;
            if (u.username && username) return String(u.username) === username;
            return false;
          }

          // Si el servidor proporcionó un usuarioNombre de nivel superior, coincidir por nombre de usuario
          if (l.usuarioNombre && username) return String(l.usuarioNombre) === username;

          // Si el servidor no incluyó información del propietario, descartar la entrada por seguridad.
          return false;
        });

        this.listas = incoming.map((l: any) => ({ id: String(l.id), name: l.nombre || l.name || ('Lista ' + l.id) }));
        // mantener la lista activa actual si está presente, de lo contrario establecer desde el servicio
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

  // Establecer la lista activa y refrescar los elementos mostrados
  selectList(id: string | undefined): void {
    if (!id) return;
    this.listaService.setActiveList(id);
    this.activeListId = id;
    this.refresh();
  }

  //Crear una nueva lista y refrescar la vista
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

  
  //Analiza una cadena de precio y la convierte en número
     precioNumerotico(precio: string): number {
    if (!precio) return 0;
    const cleaned = precio.replace(/€/g, '').replace(/\s+/g, '').replace(',', '.');
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  }
  //Total parcial para un elemento de línea
  itemSubtotal(it: ListaItem): number {
    return this.precioNumerotico(it.producto.precio) * (it.cantidad || 0);
  }

  //Total general para la lista
  grandTotal(): number {
    return this.items.reduce((sum, it) => sum + this.itemSubtotal(it), 0);
  }

  //Formatear número a cadena en euros (2 decimales, coma como separador decimal)
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

  // Incrementar la cantidad de un elemento de la lista
  increase(it: ListaItem): void {
    const nueva = (it.cantidad || 0) + 1;
    this.listaService.updateCantidad(it.producto.id, nueva);
    this.refresh();
  }

  // Disminuir la cantidad de un elemento de la lista
  decrease(it: ListaItem): void {
    const nueva = (it.cantidad || 0) - 1;
    this.listaService.updateCantidad(it.producto.id, nueva);
    this.refresh();
  }

  // Establecer la cantidad de un elemento de la lista
  setQuantity(it: ListaItem, value: string | number): void {
    const n = typeof value === 'number' ? value : parseInt(String(value), 10);
    const nueva = isNaN(n) ? 0 : n;
    this.listaService.updateCantidad(it.producto.id, nueva);
    this.refresh();
  }

  // Eliminar la lista activa después de la confirmación del usuario
  deleteActiveList(): void {
    if (!this.activeListId) return;
    const meta = this.listas.find(l => l.id === this.activeListId);
    const name = meta ? meta.name : 'lista';
    const confirmed = window.confirm(`¿Eliminar la lista "${name}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    // Eliminar vía API y luego refrescar
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